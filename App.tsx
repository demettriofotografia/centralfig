
import React, { useEffect, useState } from 'react';
import StatsCard from './components/StatsCard';
import NeuralBackground from './components/NeuralBackground';

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={filled ? "#FF4D00" : "none"} stroke={filled ? "#FF4D00" : "rgba(255,255,255,0.2)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-0.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const renderStars = (rate: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <StarIcon key={i} filled={i < rate} />
  ));
};

// Lista de feriados B3
const FERIADOS_B3 = [
  '2025-01-01', '2025-01-25', '2025-03-03', '2025-03-04', '2025-04-18', '2025-04-21', '2025-05-01', '2025-06-19', '2025-07-09', '2025-09-07', '2025-10-12', '2025-11-02', '2025-11-15', '2025-11-20', '2025-12-24', '2025-12-25', '2025-12-31',
  '2026-01-01', '2026-01-25', '2026-02-16', '2026-02-17', '2026-04-03', '2026-04-21', '2026-05-01', '2026-06-04', '2026-07-09', '2026-09-07', '2026-10-12', '2026-11-02', '2026-11-15', '2026-11-20', '2026-12-25'
];

const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  if (day === 0 || day === 6) return false; 
  const dateString = getLocalDateString(date);
  return !FERIADOS_B3.includes(dateString);
};

const getBusinessDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days: Date[] = [];
  const current = new Date(year, month, 1);
  
  while (current.getMonth() === month) {
    if (isBusinessDay(new Date(current))) {
      days.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
};

interface RowData {
  dia: string;
  valor: string;
  valorNumerico: number;
  rate: number;
  dataCalculada: string;
  hasData: boolean;
}

const SHEET_ID = '143hJGVBKDV_pGl3MRFX2JMJz6pTFNmEHs68a8MWJLdg';

const App: React.FC = () => {
  const [view, setView] = useState<'loading' | 'login' | 'dashboard'>('loading');
  const [loadingPhrase, setLoadingPhrase] = useState('Iniciando sistemas...');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [data, setData] = useState<RowData[]>([]);
  const [totals, setTotals] = useState({ 
    aporte: 'R$ 0,00', 
    lucro: 'R$ 0,00', 
    taxa: 'R$ 0,00', 
    saque: 'R$ 0,00',
    isLucroPositive: true 
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const today = new Date();
  const businessDaysOfMonth = getBusinessDaysInMonth(today);
  const totalDays = businessDaysOfMonth.length;
  
  const currentDayCount = data.length;
  const isUnlocked = currentDayCount >= 15;

  const currentHour = today.getHours();
  const isAIActive = currentHour >= 9 && currentHour < 18;

  const phrases = ["Otimizando IA...", "Sincronizando carteira...", "Finalizando autenticação quântica..."];

  useEffect(() => {
    if (view === 'loading') {
      let i = 0;
      const phraseInterval = setInterval(() => {
        setLoadingPhrase(phrases[i % phrases.length]);
        i++;
      }, 1000);
      const timer = setTimeout(() => {
        clearInterval(phraseInterval);
        setView('login');
      }, 4000);
      return () => {
        clearTimeout(timer);
        clearInterval(phraseInterval);
      };
    }
  }, [view]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setLoginError(null);
    try {
      const URL_PAGINA_3 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Página3`;
      const res = await fetch(URL_PAGINA_3);
      const text = await res.text();
      const rows = text.split('\n').map(row => row.split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim()));
      const isValid = rows.some(cols => cols[0] === username && cols[1] === password);
      if (isValid) {
        setView('dashboard');
        fetchDashboardData();
      } else {
        setLoginError("Usuário ou senha incorretos.");
      }
    } catch (err) {
      setLoginError("Erro ao validar login.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const URL_PAGINA_1 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Página1`;
      const URL_PAGINA_2 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Página2`;
      const [res1, res2] = await Promise.all([fetch(URL_PAGINA_1), fetch(URL_PAGINA_2)]);
      const text1 = await res1.text();
      const text2 = await res2.text();

      const parseCurrency = (v: string): number => {
        if (!v) return 0;
        return parseFloat(v.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
      };

      const format = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

      const rows1 = text1.split('\n').map(row => row.split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim()));
      
      const sheetDataMap = new Map<number, { valor: string, rate: number, valorNum: number }>();
      
      rows1.slice(1).forEach((cols, idx) => {
        const diaText = cols[0] || '';
        const valorRaw = cols[1] || '';
        const notaRaw = cols[2] || '';
        
        const match = diaText.match(/\d+/);
        const diaNum = match ? parseInt(match[0]) : (idx + 1);
        
        if (diaNum >= 1 && diaNum <= totalDays) {
          const vNum = parseCurrency(valorRaw);
          if (valorRaw.trim() !== '' || notaRaw.trim() !== '') {
            sheetDataMap.set(diaNum, {
              valor: valorRaw.includes('R$') ? valorRaw : format(vNum),
              rate: Math.min(Math.max(parseInt(notaRaw) || 0, 1), 5),
              valorNum: vNum
            });
          }
        }
      });

      let currentBusinessDayIdx = 0;
      const todayDateStr = getLocalDateString(today);
      businessDaysOfMonth.forEach((d, i) => {
        if (getLocalDateString(d) <= todayDateStr) {
          currentBusinessDayIdx = i + 1;
        }
      });

      const finalRows: RowData[] = [];
      for (let i = 1; i <= currentBusinessDayIdx; i++) {
        const fromSheet = sheetDataMap.get(i);
        const diaLabel = i < 10 ? `Dia 0${i}` : `Dia ${i}`;
        const dataStr = businessDaysOfMonth[i-1].toLocaleDateString('pt-BR');

        if (fromSheet) {
          finalRows.push({
            dia: diaLabel,
            valor: fromSheet.valor,
            valorNumerico: fromSheet.valorNum,
            rate: fromSheet.rate,
            dataCalculada: dataStr,
            hasData: true
          });
        } else {
          finalRows.push({
            dia: diaLabel,
            valor: "R$ 0,00",
            valorNumerico: 0,
            rate: 1,
            dataCalculada: dataStr,
            hasData: true
          });
        }
      }

      const rows2 = text2.split('\n').map(row => row.split(',').map(col => col.replace(/^"(.*)"$/, '$1').trim()));
      const aporteStr = rows2[1]?.[0] || 'R$ 0,00';
      const aporteNum = parseCurrency(aporteStr);
      
      const lucroTotal = finalRows.reduce((acc, row) => acc + row.valorNumerico, 0);
      const taxaTotal = finalRows.filter(r => r.valorNumerico > 0).reduce((acc, r) => acc + r.valorNumerico, 0) * 0.19;

      setData(finalRows);
      setTotals({
        aporte: aporteStr,
        lucro: format(lucroTotal),
        taxa: format(taxaTotal),
        saque: format(aporteNum + lucroTotal - taxaTotal),
        isLucroPositive: lucroTotal >= 0
      });
      setDashboardLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        <NeuralBackground />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#FF4D00]/20 border-t-[#FF4D00] rounded-full animate-spin mb-8"></div>
          <h1 className="text-white font-outfit text-2xl font-bold tracking-widest mb-2 uppercase">CENTRAL FIG</h1>
          <p className="text-[#FF4D00] text-xs font-bold uppercase tracking-[0.3em] animate-pulse">{loadingPhrase}</p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative">
        <NeuralBackground />
        <div className="w-full max-w-md bg-[#0D0D0D]/80 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold font-outfit text-white mb-2 uppercase tracking-tight">CENTRAL <span className="text-[#FF4D00]">FIG</span></h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest">Acesso Restrito</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FF4D00]/50 transition-all placeholder:text-gray-700" placeholder="USUÁRIO" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FF4D00]/50 transition-all placeholder:text-gray-700" placeholder="SENHA" required />
            {loginError && <div className="text-red-400 text-[10px] font-bold uppercase tracking-wider text-center">{loginError}</div>}
            <button type="submit" className="w-full bg-[#FF4D00] text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(255,77,0,0.2)] disabled:opacity-50">
              {isAuthenticating ? "AUTENTICANDO..." : "ENTRAR"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start py-8 md:py-16 bg-transparent">
      <NeuralBackground />
      <main className="max-w-5xl mx-auto w-full px-4 md:px-8 space-y-8 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold font-outfit text-white uppercase tracking-tighter">CENTRAL <span className="text-[#FF4D00]">FIG</span></h1>
          <div className={`flex items-center gap-3 bg-white/5 border px-4 py-2 rounded-full w-fit ${isAIActive ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isAIActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isAIActive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isAIActive ? 'IA ATIVADA' : 'IA DESATIVADA'}
            </span>
          </div>
        </header>

        {/* Exemplo de uso do novo StatsCard com Props title, value e description */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatsCard 
            title="APORTE" 
            value={totals.aporte} 
            description="Capital Inicial Alocado"
          />
          <StatsCard 
            title="VALORES" 
            value={totals.lucro} 
            description={totals.isLucroPositive ? "Performance Positiva" : "Performance Negativa"}
          />
          <StatsCard 
            title="TAXAS" 
            value={totals.taxa} 
            description="19% Retenção Operacional"
          />
          <StatsCard 
            title="SAQUE" 
            value={isUnlocked ? totals.saque : "FLUTUANTE"} 
            description={isUnlocked ? "SAQUE LIBERADO" : "BLOQUEADO (MÍN 15 DIAS)"}
          />
        </section>

        <section className="bg-white/[0.02] border border-white/5 p-5 md:p-8 pb-12 md:pb-14 rounded-3xl">
          <div className="flex justify-between items-center mb-10 md:mb-12">
            <span className="text-[10px] font-bold text-[#FF4D00] tracking-[0.2em] uppercase">Ciclo de Operação</span>
            <div className="bg-[#FF4D00]/10 border border-[#FF4D00]/20 px-3 py-1 rounded-lg">
              <span className="text-xs font-mono text-[#FF4D00] font-bold uppercase">{currentDayCount} / {totalDays} DIAS</span>
            </div>
          </div>
          <div className="relative h-2.5 w-full bg-white/5 rounded-full border border-white/10 overflow-visible mt-2">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF4D00] to-[#FF8A00] rounded-full shadow-[0_0_20px_rgba(255,77,0,0.3)] transition-all duration-1000" style={{ width: `${Math.min((currentDayCount / totalDays) * 100, 100)}%` }} />
            <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 z-20 flex items-center justify-center ${isUnlocked ? 'bg-emerald-500 border-emerald-300' : 'bg-[#0D0D0D] border-white/20'}`} style={{ left: `${(15 / totalDays) * 100}%` }}>
              {isUnlocked ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
              
              <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] ${isUnlocked ? 'text-emerald-400' : 'text-gray-600/70'}`}>
                  {isUnlocked ? 'SAQUE LIBERADO' : 'Liberação Saque (15)'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0D0D0D] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
          <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
             <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-white">Histórico de Performance ({new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(today)})</h3>
          </div>
          {dashboardLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-3 border-[#FF4D00]/10 border-t-[#FF4D00] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed md:table-auto">
                <thead>
                  <tr className="bg-white/[0.01] text-gray-500 text-[9px] md:text-xs uppercase tracking-[0.1em] font-bold border-b border-white/5">
                    <th className="px-3 md:px-8 py-5 w-[22%] md:w-auto">Data</th>
                    <th className="px-2 md:px-8 py-5 text-center w-[20%] md:w-auto">Ciclo</th>
                    <th className="px-2 md:px-8 py-5 text-center w-[35%] md:w-auto">Resultado IA</th>
                    <th className="px-3 md:px-8 py-5 text-right w-[23%] md:w-auto">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {data.map((row, index) => {
                    const v = row.valorNumerico;
                    const valueColorClass = v > 0 ? 'text-emerald-400' : v < 0 ? 'text-red-400' : 'text-gray-400';
                    
                    return (
                      <tr key={index} className="transition-all hover:bg-white/[0.02] group">
                        <td className="px-3 md:px-8 py-4">
                          <span className="text-[8px] md:text-[10px] font-mono text-gray-600 group-hover:text-gray-300 transition-colors uppercase tracking-tighter opacity-70">{row.dataCalculada}</span>
                        </td>
                        <td className="px-2 md:px-8 py-4 text-center">
                          <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-white">{row.dia.replace(/\D/g, '')}</span>
                        </td>
                        <td className={`px-2 md:px-8 py-4 text-[10px] md:text-sm text-center font-mono font-bold truncate ${valueColorClass}`}>{row.valor}</td>
                        <td className="px-3 md:px-8 py-4 text-right">
                          <div className="flex justify-end items-center scale-90 md:scale-100 origin-right opacity-80 group-hover:opacity-100 transition-opacity">{renderStars(row.rate)}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <footer className="mt-auto py-10 text-gray-700 text-[8px] uppercase tracking-[0.8em] font-bold opacity-30">ENCRYPTED END-TO-END</footer>
    </div>
  );
};

export default App;
