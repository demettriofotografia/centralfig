
import React, { useState } from 'react';
import { OperatorUser } from '../types';
import { UserPlus, Trash2, Users, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';

interface AdminPanelProps {
  users: OperatorUser[];
  onAddUser: (login: string, pass: string) => void;
  onDeleteUser: (id: string) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, onAddUser, onDeleteUser, onLogout }) => {
  const [newLogin, setNewLogin] = useState('');
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogin || !newPass) {
      setError('Preencha todos os campos');
      return;
    }
    if (users.some(u => u.login === newLogin.toUpperCase())) {
      setError('Login já existe');
      return;
    }
    onAddUser(newLogin.toUpperCase(), newPass.toUpperCase());
    setNewLogin('');
    setNewPass('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-12 font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* Ambience */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                <ShieldCheck size={28} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Painel Administrativo</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Gestão de Acessos FIG PRO</p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 bg-[#121216] border border-white/5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:border-orange-500/30 transition-all uppercase tracking-wide"
          >
            <ArrowLeft size={16} />
            Sair do Painel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[#0A0A0F] border border-white/5 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center gap-2 mb-6 text-orange-500">
                <UserPlus size={18} />
                <h2 className="text-sm font-bold uppercase tracking-widest">Novo Operador</h2>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Login</label>
                  <input 
                    type="text" 
                    value={newLogin}
                    onChange={(e) => setNewLogin(e.target.value)}
                    className="w-full bg-[#121216] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors uppercase"
                    placeholder="EX: JOAO123"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Senha</label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input 
                      type="text" 
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full bg-[#121216] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors uppercase"
                      placeholder="EX: SENHA123"
                    />
                  </div>
                </div>
                
                {error && <p className="text-[10px] text-rose-500 font-bold text-center uppercase tracking-tighter">{error}</p>}
                
                <button 
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/20 uppercase text-xs tracking-widest mt-2"
                >
                  Cadastrar Acesso
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#0A0A0F] border border-white/5 p-6 rounded-3xl shadow-xl h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={18} />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Operadores Ativos</h2>
                </div>
                <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md font-mono">{users.length} USUÁRIOS</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {users.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/5 rounded-2xl opacity-50">
                    <Users size={32} className="mb-2" />
                    <p className="text-xs uppercase tracking-widest">Nenhum operador cadastrado</p>
                  </div>
                ) : (
                  users.map(user => (
                    <div key={user.id} className="group flex items-center justify-between p-4 bg-[#121216] rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-orange-500/50 group-hover:text-orange-500 transition-colors">
                            <ShieldCheck size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white tracking-tight">{user.login}</div>
                            <div className="text-[10px] text-gray-500 font-mono">PWD: {user.password}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="text-[9px] text-gray-600 font-medium uppercase hidden sm:block">Desde {user.createdAt}</div>
                          {user.login !== 'SAMUELTAVARES' ? (
                            <button 
                              onClick={() => onDeleteUser(user.id)}
                              className="p-2.5 text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                              title="Remover Acesso"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <div className="p-2.5 text-gray-800" title="Acesso Mestre - Permanente">
                              <ShieldCheck size={16} />
                            </div>
                          )}
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
