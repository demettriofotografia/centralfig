
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

// January 2026 has 21 business days excluding weekends and Jan 1st holiday
const INITIAL_ROWS = 21;
const PERMANENT_USER: OperatorUser = {
  id: 'perm-user-001',
  login: 'SAMUELTAVARES',
  password: 'AMPLIFIELD1#', // Normalized to uppercase for comparison consistency
  createdAt: '01/01/2026'
};

const generateBusinessDays = (count: number): string[] => {
  const labels: string[] = [];
  // Start at Jan 1st, 2026 (Thursday)
  const currentDate = new Date(2026, 0, 1); 
  // Holidays in January: 1/0 (Jan 1st - Confraternização Universal)
  const holidays = ["1/0"]; 
  
  while (labels.length < count) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sun, 6 = Sat
    const day = currentDate.getDate();
    const month = currentDate.getMonth(); 
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateKey = `${day}/${month}`;
    const isHoliday = holidays.includes(dateKey);

    if (!isWeekend && !isHoliday) {
      const dayStr = day.toString().padStart(2, '0');
      // Format: "02 Sex" (example)
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
    
    // Ensure the permanent user is always present
    if (!users.some(u => u.login === PERMANENT_USER.login)) {
      users = [PERMANENT_USER, ...users];
    }
    return users;
  });

  const [initialCapital, setInitialCapital] = useState<number>(() => {
    const savedCapital = localStorage.getItem('fig_pro_capital');
    // Updated default initial capital to 4038.37
    return savedCapital ? parseFloat(savedCapital) : 4038.37;
  });
  
  const [data, setData] = useState<DayEntry[]>(() => {
    const savedData = localStorage.getItem('fig_pro_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed;
    }
    
    const dayLabels = generateBusinessDays(INITIAL_ROWS);
    const initialData = dayLabels.map((label, i) => ({
      id: i,
      dayLabel: label,
      sentiment: null,
      note: '',
      rating: 0,
      dailyValue: 0,
      maxValue: 0,
      highlight: null
    }));
    
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('fig_pro_operators', JSON.stringify(operatorUsers));
  }, [operatorUsers]);

  useEffect(() => {
    localStorage.setItem('fig_pro_data', JSON.stringify(data));
    localStorage.setItem('fig_pro_capital', initialCapital.toString());
  }, [data, initialCapital]);

  const handleUpdate = useCallback((id: number, field: keyof DayEntry, value: any) => {
    setData(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updatedItem = { ...item, [field]: value };
      if (field === 'dailyValue') {
        const numVal = Number(value);
        if (numVal > 0) updatedItem.sentiment = 'positive';
        else if (numVal < 0) updatedItem.sentiment = 'negative';
        else if (numVal === 0) updatedItem.sentiment = 'neutral';
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

  if (view === 'login') {
    return <LoginScreen onLogin={handleLogin} operatorUsers={operatorUsers} />;
  }

  if (view === 'admin') {
    return (
      <AdminPanel 
        users={operatorUsers} 
        onAddUser={handleAddUser} 
        onDeleteUser={handleDeleteUser} 
        onLogout={() => setView('login')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#050505] text-white font-['Plus_Jakarta_Sans'] relative">
      <BackgroundEffect />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent pointer-events-none z-10"></div>
      
      <header className="h-20 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-20 relative">
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
          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs font-bold text-orange-500 hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(249,115,22,0.1)]"
          >
            <Info size={14} />
            Tipos de perfil
          </button>

          <button 
            onClick={() => setView('login')}
            className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[10px] font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest"
          >
            <LogOut size={12} /> Sair
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-white/5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">Operator Session</p>
              <p className="text-[10px] text-orange-500 uppercase tracking-widest font-bold">Acesso Restrito</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-orange-500/30 p-0.5">
              <div className="w-full h-full rounded-full bg-[#121215] flex items-center justify-center">
                <UserCircle size={24} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative z-10">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <Dashboard 
              data={data} 
              initialCapital={initialCapital}
              setInitialCapital={setInitialCapital}
          />

          <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm bg-opacity-90">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20"></div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-1 h-8 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
                 <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Diário de Operações (Jan 2026)</h2>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Registro Oficial</div>
                 </div>
              </div>
              
              <div className="flex gap-2">
                 <button 
                  onClick={handleResetJournal}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase tracking-wide mr-2"
                 >
                   <Trash2 size={14} />
                   RESETAR DIARIO
                 </button>

                 <button 
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-[#121216] border border-white/5 rounded-lg text-xs text-gray-400 hover:text-white hover:border-orange-500/30 transition-all uppercase tracking-wide"
                 >
                   Exportar
                 </button>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-[#121216]/50 rounded-xl border border-white/5">
                <div className="col-span-1">Dia</div>
                <div className="col-span-3 grid grid-cols-2 gap-2 text-center">
                  <span>Resultado</span>
                  <span>Max Atingido</span>
                </div>
                <div className="col-span-3 text-center">Sentimento</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-2">Notas</div>
                <div className="col-span-2 text-right">Avaliação</div>
            </div>

            <div className="space-y-3">
              {data.map((entry) => (
                <RowItem 
                  key={entry.id} 
                  entry={entry} 
                  onUpdate={handleUpdate} 
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <ProfileTypesModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
}

export default App;
