
import React, { useState, useEffect, useRef } from 'react';
import { Zap, Cpu, Clock, Lock, Power, KeyRound, AlertCircle, Settings2 } from 'lucide-react';

interface Trade {
  id: number;
  value: number;
  time: string;
}

const HFTWidget: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  
  // Modes: Auto (Default) vs Manual (Password Protected)
  const [isManualMode, setIsManualMode] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when shown
  useEffect(() => {
    if (showPasswordInput && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showPasswordInput]);
  
  // Market Status Logic (09:00 - 17:45, Mon-Fri)
  useEffect(() => {
    const checkMarketStatus = () => {
       const now = new Date();
       const day = now.getDay(); // 0 = Sun, 6 = Sat
       const hour = now.getHours();
       const minute = now.getMinutes();

       // Check Weekday (Mon=1 to Fri=5)
       const isWeekday = day >= 1 && day <= 5;
       
       // Check Time (09:00 to 17:45)
       const isAfterStart = (hour > 9) || (hour === 9 && minute >= 0);
       const isBeforeEnd = (hour < 17) || (hour === 17 && minute <= 45);

       const isOpen = isWeekday && isAfterStart && isBeforeEnd;
       setIsMarketOpen(isOpen);
    };

    checkMarketStatus();
    const statusInterval = setInterval(checkMarketStatus, 60000); // Check every minute
    return () => clearInterval(statusInterval);
  }, []);

  // Bot Trading Logic
  useEffect(() => {
    // Run if: Manual Mode is ON OR (Auto Mode is ON and Market is Open)
    const shouldRun = isManualMode || isMarketOpen;

    if (!shouldRun) return;

    const interval = setInterval(() => {
      // 1. Value Generation Logic: R$ 0.01 to R$ 2.00
      const rawValue = (Math.random() * 1.99) + 0.01;
      
      const isPositive = Math.random() > 0.45; 
      const finalValue = isPositive ? rawValue : -rawValue;

      const newTrade: Trade = {
        id: Date.now() + Math.random(),
        value: finalValue,
        time: new Date().toLocaleTimeString('pt-BR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setTrades(prev => [newTrade, ...prev].slice(0, 13)); 

    }, 120); // Slightly adjusted speed for readability with more rows

    return () => clearInterval(interval);
  }, [isMarketOpen, isManualMode]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Amplifield1#') {
        setIsManualMode(true);
        setShowPasswordInput(false);
        setAuthError(false);
        setPasswordInput('');
    } else {
        setAuthError(true);
        setTimeout(() => setAuthError(false), 2000);
    }
  };

  const handleToggleAuth = () => {
      if (isManualMode) {
          // Switch back to Auto
          setIsManualMode(false);
          // Optional: Clear trades if market is closed when switching back
          if (!isMarketOpen) setTrades([]);
      } else {
          // Show Input to enable Manual
          setShowPasswordInput(true);
      }
  };

  // Determine active status for display
  const isRunning = isManualMode || isMarketOpen;

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-[#121216] rounded-2xl border border-white/5 relative overflow-hidden group">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5 relative z-20">
            <div className={`flex items-center gap-2 ${isRunning ? 'text-orange-500' : 'text-gray-600'}`}>
                {isRunning ? <Cpu size={14} className="animate-pulse" /> : <Lock size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">HFT BOT</span>
            </div>
            
            <div className="flex items-center gap-2">
                {/* Mode Indicator */}
                <div className="px-1.5 py-0.5 rounded border border-white/5 bg-black/20 text-[8px] font-mono uppercase text-gray-400">
                    {isManualMode ? 'MANUAL' : 'AUTO'}
                </div>

                {/* Activation/Mode Button */}
                <button 
                    onClick={handleToggleAuth}
                    className={`p-1 rounded-md transition-all duration-300 ${
                        isManualMode 
                        ? 'text-orange-500 hover:text-orange-400 bg-orange-500/10' 
                        : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                    }`}
                    title={isManualMode ? "Desativar Modo Manual" : "Ativar Modo Manual (Senha)"}
                >
                    {isManualMode ? <Power size={12} /> : <Settings2 size={12} />}
                </button>

                {/* Status Dot */}
                <div className="flex items-center gap-1.5 ml-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                        isManualMode ? 'bg-orange-500 animate-pulse' : 
                        isMarketOpen ? 'bg-emerald-500 animate-ping' : 
                        'bg-rose-500'
                    }`}></div>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative space-y-1 font-mono flex flex-col">
            
            {/* 1. Password Input Overlay */}
            {showPasswordInput && (
                 <div className="absolute inset-0 z-30 bg-[#121216] flex flex-col items-center justify-center">
                    <form onSubmit={handlePasswordSubmit} className="w-full px-2">
                        <div className="relative flex items-center mb-2">
                             <KeyRound size={12} className="absolute left-3 text-gray-500" />
                             <input 
                                ref={inputRef}
                                type="password" 
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Access Key..."
                                className={`w-full bg-[#0A0A0F] border text-[10px] rounded-lg py-2 pl-8 pr-2 focus:outline-none transition-colors ${
                                    authError 
                                    ? 'border-rose-500 text-rose-500 placeholder-rose-500/50' 
                                    : 'border-white/10 text-gray-300 focus:border-orange-500/30'
                                }`}
                                onBlur={() => !passwordInput && setShowPasswordInput(false)}
                             />
                        </div>
                        {authError && <p className="text-[9px] text-rose-500 text-center font-bold">INVALID KEY</p>}
                    </form>
                 </div>
            )}

            {/* 2. Main Display Logic */}
            {!isRunning ? (
                 // Market Closed State (Auto Mode)
                 <div className="flex-1 flex flex-col items-center justify-center text-gray-700 gap-2 opacity-50">
                    <Clock size={20} />
                    <span className="text-[9px] uppercase tracking-wider text-center">
                        Mercado Fechado<br/>09:00 - 17:45
                    </span>
                    <span className="text-[8px] text-gray-800 mt-1">AUTO MODE ACTIVE</span>
                </div>
            ) : (
                // Active Trading State (Auto or Manual)
                <>
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#121216] to-transparent pointer-events-none z-10"></div>
                    <div className="flex flex-col gap-1.5 h-full pt-1">
                        {trades.map((trade) => (
                            <div key={trade.id} className="flex justify-between items-center text-[10px] md:text-[11px] animate-in slide-in-from-right fade-in duration-300 border-b border-white/[0.02] pb-0.5">
                                <span className="text-gray-600 font-medium opacity-80">{trade.time}</span>
                                <span className={`font-bold tabular-nums ${trade.value >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {trade.value >= 0 ? '+' : ''} R$ {Math.abs(trade.value).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>

        {/* Effects */}
        {isRunning && (
             <>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent pointer-events-none h-full w-full animate-[scan_1.5s_ease-in-out_infinite] opacity-30"></div>
                <style>{`
                    @keyframes scan {
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(100%); }
                    }
                `}</style>
             </>
        )}
    </div>
  );
};

export default HFTWidget;
