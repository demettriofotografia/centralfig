
import React, { useState } from 'react';
import { Lock, ShieldCheck, Terminal, AlertCircle, User, Settings, ShieldAlert, Key } from 'lucide-react';
import { OperatorUser } from '../types';

interface LoginScreenProps {
  onLogin: (role: 'admin' | 'operator') => void;
  operatorUsers: OperatorUser[];
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, operatorUsers }) => {
  const [mode, setMode] = useState<'operator' | 'admin'>('operator');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputLogin = login.trim().toUpperCase();
    const inputPass = password.trim().toUpperCase();

    if (mode === 'admin') {
      if (inputLogin === 'FIGADM' && inputPass === 'FIGADM') {
        onLogin('admin');
      } else {
        triggerError();
      }
    } else {
      const userFound = operatorUsers.find(
        u => u.login === inputLogin && u.password === inputPass
      );
      if (userFound) {
        onLogin('operator');
      } else {
        triggerError();
      }
    }
  };

  const triggerError = () => {
    setError(true);
    setTimeout(() => setError(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* Background Decorativo */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-[700px] h-[700px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[500px] relative z-10">
        
        {/* Border Frame Style conforme print */}
        <div className="border border-rose-500/20 p-8 md:p-12 rounded-[2px] bg-transparent backdrop-blur-sm flex flex-col items-center shadow-[0_0_50px_rgba(244,63,94,0.03)]">
            
            <div className="mb-6 relative">
                <div className="w-16 h-16 rounded-2xl bg-[#16161D] border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                    <Terminal className="text-orange-500" size={32} />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight mb-1 text-center">SYSTEM ACCESS</h1>
            <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase mb-10 font-medium">Performance Tracker V22</p>

            {/* Selector de Modo: Estilizado conforme print */}
            <div className="grid grid-cols-2 w-full gap-2 mb-8">
                <button 
                    type="button"
                    onClick={() => { setMode('operator'); setLogin(''); setPassword(''); }}
                    className={`py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 border ${
                      mode === 'operator' 
                      ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]' 
                      : 'bg-transparent border-white/5 text-gray-500 hover:text-gray-400'
                    }`}
                >
                    <User size={14} /> Usuário
                </button>
                <button 
                    type="button"
                    onClick={() => { setMode('admin'); setLogin(''); setPassword(''); }}
                    className={`py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 border ${
                      mode === 'admin' 
                      ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]' 
                      : 'bg-transparent border-white/5 text-gray-500 hover:text-gray-400'
                    }`}
                >
                    <ShieldAlert size={14} /> Admin
                </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div className="bg-[#0F0F14]/60 border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">Código de Acesso</label>
                            <div className="relative group">
                                <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    type="text"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    className="w-full bg-[#16161D] border border-white/5 text-white text-sm rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500/40 transition-all uppercase placeholder-gray-800"
                                    placeholder="USUÁRIO"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] ml-1">Senha de Segurança</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#16161D] border border-white/5 text-white text-sm rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-orange-500/40 transition-all uppercase placeholder-gray-800"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.2)] active:scale-[0.98] uppercase tracking-[0.15em] text-xs mt-4"
                        >
                            Iniciar Sessão
                        </button>

                        <div className={`h-2 text-rose-500 text-[9px] font-bold text-center uppercase tracking-widest transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
                            Dados de acesso incorretos
                        </div>
                    </div>
                </div>
            </form>

            <div className="mt-8">
                <div className="flex items-center gap-3 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] px-4 py-2 border border-white/5 rounded-full">
                    <span>Secure Connection</span>
                    <span className="text-orange-500">•</span>
                    <span>Encrypted</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
