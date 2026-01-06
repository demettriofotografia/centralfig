import React, { useState, useCallback, useEffect } from 'react';
import { DayEntry, OperatorUser } from './types';
import RowItem from './components/RowItem';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';
import BackgroundEffect from './components/BackgroundEffect';
import ProfileTypesModal from './components/ProfileTypesModal';
import { jsPDF } from 'jspdf';
import { 
  Bell, 
  UserCircle,
  ShieldCheck,
  Save,
  Trash2,
  LogOut,
  Info
} from 'lucide-react';
import Papa from 'papaparse';

// Janeiro 2026: 21 dias úteis
const INITIAL_ROWS = 21;
const PERMANENT_USER: OperatorUser = {
  id: 'perm-user-001',
  login: 'SAMUELTAVARES',
  password: 'AMPLIFIELD1#',
  createdAt: '01/01/2026'
};

const generateBusinessDays = (count: number): string[] => {
  const labels: string[] = [];
  const currentDate = new Date(2026, 0, 1);
  const holidays = ["1/0"];
  
  while (labels.length < count) {
    const dayOfWeek = currentDate.getDay();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const dateKey = `${day}/${month}`;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidays.includes(dateKey);

    if (!isWeekend && !isHoliday) {
      const dayStr = day.toString().padStart(2, '0');
      const weekStrRaw = currentDate.toLocaleDateString('pt-BR', { weekday: 'short' });
      const weekStr = weekStrRaw.replace('.', '').charAt(0).toUpperCase() + weekStrRaw.replace('.', '').slice(1);
      labels.push(`${dayStr} ${weekStr}`);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return labels;
};

function App() {
  const [view, setView] = useState<'login' | 'app' | 'admin'>('login');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [operatorUsers, setOperatorUsers] = useState<OperatorUser[]>(() => {
    const saved = localStorage.getItem('fig_pro_operators');
    let users: OperatorUser[] = saved ? JSON.parse(saved) : [];
    if (!users.some(u => u.login === PERMANENT_USER.login)) {
      users = [PERMANENT_USER, ...users];
    }
    return users;
  });

  const [initialCapital, setInitialCapital] = useState<number>(() => {
    const savedCapital = localStorage.getItem('fig_pro_capital');
    return savedCapital ? parseFloat(savedCapital) : 4038.37;
  });

  const [data, setData] = useState<DayEntry[]>([]);

  // 🔹 Carregar dados do Google Sheets
  useEffect(() => {
    const url = "https://docs.google.com/spreadsheets/d/1nG6d5BSKiZwXiXVhMSh8AqR2q8Pf4XBLlm7sp6ADQkE/gviz/tq?tqx=out:csv&sheet=SITE";

    fetch(url)
      .then(res => res.text())
      .then(csvText => {
        const parsed = Papa.parse(csvText, { header: true });
        const formatted = parsed.data.map((row: any, index: number) => ({
          id: Number(row.id) || index,
          dayLabel: row.dayLabel,
          dailyValue: Number(row.dailyValue) || 0,
          maxValue: Number(row.maxValue) || 0,
          sentiment: row.sentiment || null,
          rating: Number(row.rating) || 0,
          note: row.note || "",
          highlight: row.highlight === "null" ? null : row.highlight
        }));
        setData(formatted);
      })
      .catch(err => console.error("Erro ao carregar CSV:", err));
  }, []);

  // 🔹 Salvar alterações localmente
  useEffect(() => {
    localStorage.setItem('fig_pro_operators', JSON.stringify(operatorUsers));
    localStorage.setItem('fig_pro_data', JSON.stringify(data));
    localStorage.setItem('fig_pro_capital', initialCapital.toString());
  }, [operatorUsers, data, initialCapital]);

  const handleUpdate = useCallback((id: number, field: keyof DayEntry, value: any) => {
    setData(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updatedItem = { ...item, [field]: value };
      if (field === 'dailyValue') {
        const numVal = Number(value);
        if (numVal > 0) updatedItem.sentiment = 'positive';
        else if (numVal < 0) updatedItem.sentiment = 'negative';
        else updatedItem.sentiment = 'neutral';
      }
      return updatedItem;
    }));
  }, []);

  const handleResetJournal = () => {
    const pwd = window.prompt("Digite a senha de segurança para resetar:");
    if (pwd === "Amplifield1#") {
      if (window.confirm('Tem certeza? Isso apagará todos os dados e atualizará para Janeiro/2026.')) {
        const dayLabels = generateBusinessDays(INITIAL_ROWS);
        const emptyData = dayLabels.map((label, i) => ({
            id: i,
            dayLabel: label,
            sentiment: null,
            note: '',
            rating: 0,
            dailyValue: 0,
            maxValue: 0,
            highlight: null
        }));
        setData(emptyData);
        localStorage.removeItem('fig_pro_data');
      }
    } else if (pwd !== null) {
      alert("Senha incorreta.");
    }
  };

  const handleAddUser = (login: string, password: string) => {
    const newUser: OperatorUser = {
      id: Math.random().toString(36).substr(2, 9),
      login,
      password,
      createdAt: new Date().toLocaleDateString('pt-BR')
    };
    setOperatorUsers([...operatorUsers, newUser]);
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = operatorUsers.find(u => u.id === id);
    if (userToDelete?.login === PERMANENT_USER.login) {
      alert(`O usuário ${PERMANENT_USER.login} é um acesso mestre e não pode ser removido.`);
      return;
    }
    if (window.confirm('Excluir este acesso permanentemente?')) {
      setOperatorUsers(operatorUsers.filter(u => u.id !== id));
    }
  };

  const handleLogin = (role: 'admin' | 'operator') => {
    setView(role === 'admin' ? 'admin' : 'app');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("RELATÓRIO DE PERFORMANCE FIG PRO - JANEIRO 2026", 105, 20, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    const grossProfit = data.reduce((acc, curr) => curr.dailyValue > 0 ? acc + curr.dailyValue : acc, 0);
    const grossLoss = data.reduce((acc, curr) => curr.dailyValue < 0 ? acc + curr.dailyValue : acc, 0);
    const fees = grossProfit * 0.19;
    const netPnL = (grossProfit + grossLoss) - fees;
    const finalBalance = initialCapital + netPnL;
    doc.setFontSize(12);
    doc.text("RESUMO FINANCEIRO", 20, 35);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Caixa Inicial: R$ ${initialCapital.toFixed(2)}`, 20, 45);
    doc.text(`Lucro Bruto: R$ ${grossProfit.toFixed(2)}`, 20, 52);
    doc.text(`Prejuízo Bruto: R$ ${Math.abs(grossLoss).toFixed(2)}`, 20, 59);
    doc.text(`Taxas (19%): R$ ${fees.toFixed(2)}`, 20, 66);
    doc.setFont("helvetica", "bold");
    doc.text(`Saldo Líquido Final: R$ ${finalBalance.toFixed(2)}`, 20, 75);
    doc.save("relatorio_fig_pro_jan26.pdf");
  };

  if (view === 'login') return <LoginScreen onLogin={handleLogin} operatorUsers={operatorUsers} />;
  if (view === 'admin') return <AdminPanel users={operatorUsers} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} onLogout={() => setView('login')} />;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#050505] text-white font-['Plus_Jakarta_Sans'] relative">
      <BackgroundEffect />
      <header className="h-20 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-20 relative">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none tracking-tight">FIG <span className="text-orange-500">PRO</span></h1>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Fundo de Investimento Gráfico</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs font-bold text-orange-500 hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            <Info size={14} /> Tipos de perfil
          </button>
          <button onClick={() => setView('login')} className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest">
            <LogOut size={12} /> Sair
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative z-10">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <Dashboard data={data} initialCapital={initialCapital} setInitialCapital={setInitialCapital} />

          <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm bg-opacity-90">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white tracking-tight">Diário de Operações (Jan 2026)</h2>
              <div className="flex gap-2">
                <button onClick={handleResetJournal} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase tracking-wide mr-2">
                  <Trash2 size={14} /> RESETAR DIARIO
                </button>
                <button onClick={handleExportPDF} className="px-4 py-2 bg-[#121216] border border-white/5 rounded-lg text-xs text-gray-400 hover:text-white hover:border-orange-500/30 transition-all uppercase tracking-wide">
                  Exportar
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {data.map(entry => <RowItem key={entry.id} entry={entry} onUpdate={handleUpdate} />)}
            </div>
          </div>
        </div>
      </main>

      <ProfileTypesModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
}

export default App;
