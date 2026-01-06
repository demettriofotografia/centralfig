import React, { useEffect, useState, useCallback } from 'react';
import { DayEntry, OperatorUser } from './types';
import RowItem from './components/RowItem';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import AdminPanel from './components/AdminPanel';
import BackgroundEffect from './components/BackgroundEffect';
import ProfileTypesModal from './components/ProfileTypesModal';
import { jsPDF } from 'jspdf';
import {
  ShieldCheck,
  UserCircle,
  Trash2,
  LogOut,
  Info,
} from 'lucide-react';

/* ===================== CONFIGURAÇÕES ===================== */

const SHEET_URL =
  'https://sheetjson.com/spreadsheets/d/1nG6d5BSKiZwXiXVhMSh8AqR2q8Pf4XBLlm7sp6ADQkE';

const PERMANENT_USER: OperatorUser = {
  id: 'perm-user-001',
  login: 'SAMUELTAVARES',
  password: 'AMPLIFIELD1#',
  createdAt: '01/01/2026',
};

/* ===================== APP ===================== */

function App() {
  const [view, setView] = useState<'login' | 'app' | 'admin'>('login');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [operatorUsers] = useState<OperatorUser[]>([PERMANENT_USER]);
  const [initialCapital, setInitialCapital] = useState<number>(4038.37);
  const [data, setData] = useState<DayEntry[]>([]);

  /* ===================== BUSCA DA PLANILHA ===================== */

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const response = await fetch(SHEET_URL);
        const rows = await response.json();

        const parsed: DayEntry[] = rows.map((row: any) => ({
          id: Number(row.id),
          dayLabel: row.dayLabel,
          dailyValue: Number(row.dailyValue) || 0,
          maxValue: Number(row.maxValue) || 0,
          sentiment: row.sentiment ?? null,
          rating: Number(row.rating) || 0,
          note: row.note ?? '',
          highlight: row.highlight ?? null,
        }));

        console.log('DADOS DA PLANILHA:', parsed);
        setData(parsed);
      } catch (error) {
        console.error('Erro ao carregar planilha:', error);
      }
    };

    fetchSheet();
  }, []);

  /* ===================== HANDLERS ===================== */

  const handleUpdate = useCallback(
    (id: number, field: keyof DayEntry, value: any) => {
      setData(prev =>
        prev.map(item => {
          if (item.id !== id) return item;

          const updated = { ...item, [field]: value };

          if (field === 'dailyValue') {
            const v = Number(value);
            if (v > 0) updated.sentiment = 'positive';
            else if (v < 0) updated.sentiment = 'negative';
            else updated.sentiment = 'neutral';
          }

          return updated;
        })
      );
    },
    []
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();

    const grossProfit = data.reduce(
      (acc, d) => (d.dailyValue > 0 ? acc + d.dailyValue : acc),
      0
    );

    const grossLoss = data.reduce(
      (acc, d) => (d.dailyValue < 0 ? acc + d.dailyValue : acc),
      0
    );

    const fees = grossProfit * 0.19;
    const netPnL = grossProfit + grossLoss - fees;
    const finalBalance = initialCapital + netPnL;

    doc.setFontSize(16);
    doc.text('RELATÓRIO DE PERFORMANCE - JAN 2026', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Caixa Inicial: R$ ${initialCapital.toFixed(2)}`, 20, 40);
    doc.text(`Lucro Bruto: R$ ${grossProfit.toFixed(2)}`, 20, 48);
    doc.text(`Prejuízo Bruto: R$ ${Math.abs(grossLoss).toFixed(2)}`, 20, 56);
    doc.text(`Taxas (19%): R$ ${fees.toFixed(2)}`, 20, 64);
    doc.text(`Saldo Final: R$ ${finalBalance.toFixed(2)}`, 20, 72);

    doc.save('relatorio_fig_pro_jan_2026.pdf');
  };

  /* ===================== TELAS ===================== */

  if (view === 'login') {
    return <LoginScreen onLogin={role => setView(role === 'admin' ? 'admin' : 'app')} operatorUsers={operatorUsers} />;
  }

  if (view === 'admin') {
    return (
      <AdminPanel
        users={operatorUsers}
        onAddUser={() => {}}
        onDeleteUser={() => {}}
        onLogout={() => setView('login')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white">
      <BackgroundEffect />

      <header className="h-20 flex items-center justify-between px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-orange-500" />
          <h1 className="font-bold">
            FIG <span className="text-orange-500">PRO</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowProfileModal(true)}
            className="text-orange-500 text-xs flex items-center gap-1"
          >
            <Info size={14} /> Tipos de Perfil
          </button>

          <button
            onClick={() => setView('login')}
            className="text-rose-500 text-xs flex items-center gap-1"
          >
            <LogOut size={14} /> Sair
          </button>

          <UserCircle className="text-gray-400" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <Dashboard
          data={data}
          initialCapital={initialCapital}
          setInitialCapital={setInitialCapital}
        />

        <div className="mt-8 bg-[#0A0A0F] rounded-3xl p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold">Diário de Operações (Jan 2026)</h2>

            <div className="flex gap-2">
              <button className="text-red-500 text-xs flex items-center gap-1">
                <Trash2 size={14} /> Reset via Planilha
              </button>

              <button
                onClick={handleExportPDF}
                className="text-gray-400 text-xs"
              >
                Exportar
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {data.map(entry => (
              <RowItem
                key={entry.id}
                entry={entry}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      </main>

      <ProfileTypesModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}

export default App;
