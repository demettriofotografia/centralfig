
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { DayEntry } from '../types';
import MarketWidget from './MarketWidget';
import HFTWidget from './HFTWidget';
import { 
  Percent, 
  Wallet,
  Activity,
  CalendarClock,
  Trophy,
  Target,
  MinusCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface DashboardProps {
  data: DayEntry[];
  initialCapital: number;
  setInitialCapital: (val: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    data, 
    initialCapital,
    setInitialCapital
}) => {
  
  // --- Financial Calculations ---
  const grossProfit = data.reduce((acc, curr) => curr.dailyValue > 0 ? acc + curr.dailyValue : acc, 0);
  const grossLoss = data.reduce((acc, curr) => curr.dailyValue < 0 ? acc + curr.dailyValue : acc, 0);
  const fees = grossProfit * 0.19;
  const netPnL = (grossProfit + grossLoss) - fees;
  const currentBalance = initialCapital + netPnL;

  // --- Statistics ---
  const winCount = data.filter(d => d.sentiment === 'positive').length;
  const lossCount = data.filter(d => d.sentiment === 'negative').length;
  const neutralCount = data.filter(d => d.sentiment === 'neutral').length;
  const totalRatedDays = winCount + lossCount + neutralCount;
  const winRate = totalRatedDays > 0 ? Math.round((winCount / totalRatedDays) * 100) : 0;
  const totalDays = data.length;

  const pieData = [
    { name: 'Loss', value: lossCount, color: '#DC2626' }, 
    { name: 'Neutro', value: neutralCount, color: '#52525B' }, 
    { name: 'Gain', value: winCount, color: '#F97316' }, 
  ].filter(d => d.value > 0);

  const finalPieData = pieData.length > 0 ? pieData : [{ name: 'Empty', value: 1, color: '#27272A' }];

  return (
    <div className="flex flex-col gap-8 mb-8">
      
      {/* SECTION 1: PERFORMANCE / WIN RATE / MARKET */}
      <div className="bg-[#0A0A0F] rounded-3xl border border-white/5 p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <Activity size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Analytics & Mercado</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Performance Mensal ({totalDays} Dias)</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            
            {/* Left Column: Metrics & Main Chart/Widget */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Status Cards Row - Enhanced Styling */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-[#121216] to-[#0A0A0F] border border-white/5 p-5 rounded-2xl flex flex-col hover:border-orange-500/30 transition-all group/card shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                           <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover/card:scale-110 transition-transform">
                              <Trophy size={18} />
                           </div>
                           <TrendingUp size={14} className="text-emerald-500/30" />
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Gains</span>
                        <span className="text-3xl font-bold text-white tracking-tighter mt-1">{winCount}</span>
                        <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: `${(winCount/totalDays)*100}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#121216] to-[#0A0A0F] border border-white/5 p-5 rounded-2xl flex flex-col hover:border-rose-500/30 transition-all group/card shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                           <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 group-hover/card:scale-110 transition-transform">
                              <Target size={18} />
                           </div>
                           <TrendingDown size={14} className="text-rose-500/30" />
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Losses</span>
                        <span className="text-3xl font-bold text-white tracking-tighter mt-1">{lossCount}</span>
                        <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                           <div className="h-full bg-rose-500" style={{ width: `${(lossCount/totalDays)*100}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#121216] to-[#0A0A0F] border border-white/5 p-5 rounded-2xl flex flex-col hover:border-gray-500/30 transition-all group/card shadow-xl">
                        <div className="flex items-center justify-between mb-2">
                           <div className="p-2 rounded-lg bg-gray-500/10 text-gray-400 group-hover/card:scale-110 transition-transform">
                              <MinusCircle size={18} />
                           </div>
                           <div className="w-3.5 h-3.5 border border-gray-500/30 rounded-full"></div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Neutro</span>
                        <span className="text-3xl font-bold text-white tracking-tighter mt-1">{neutralCount}</span>
                        <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                           <div className="h-full bg-gray-500" style={{ width: `${(neutralCount/totalDays)*100}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Market Widget - Now moved here to occupy the main space */}
                <div className="flex-1 min-h-[450px] bg-[#121216]/50 rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative">
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Market Data</span>
                    </div>
                    <MarketWidget />
                </div>
            </div>

            {/* Right Column: Win Rate & HFT */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Win Rate Section */}
                <div className="h-64 relative bg-[#121216]/50 rounded-2xl border border-white/5 overflow-hidden group/chart flex flex-col items-center justify-center p-6 shadow-xl">
                    <div className="absolute top-4 left-4 z-20 bg-[#0A0A0F]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                            <CalendarClock size={12} />
                        </div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-[0.2em]">Win Rate</div>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={finalPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={6}
                                >
                                    {finalPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-5xl font-bold text-white tracking-tighter">{winRate}<span className="text-2xl text-orange-500">%</span></span>
                            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.3em] mt-2">Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* HFT Bot Section */}
                <div className="flex-1 min-h-[300px] shadow-xl">
                    <HFTWidget />
                </div>
            </div>

        </div>
      </div>

      {/* SECTION 2: FINANCIAL SUMMARY */}
      <div className="bg-[#0A0A0F] rounded-3xl border border-white/5 p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-center">
            
            <div className="lg:col-span-4 flex flex-col justify-center items-center gap-2 p-8 bg-[#121216] rounded-2xl border border-white/5 hover:border-orange-500/20 transition-colors group">
                <label className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-3">
                    <Wallet size={14} /> Caixa Inicial
                </label>
                <div className="flex items-center justify-center gap-2 text-4xl font-bold text-white w-full">
                    <span className="text-gray-600 font-light text-2xl">R$</span>
                    <input 
                        type="number" 
                        value={initialCapital}
                        onChange={(e) => setInitialCapital(Number(e.target.value))}
                        className="bg-transparent border-none outline-none w-40 text-center text-white placeholder-gray-700 group-focus-within:text-orange-500 transition-colors tracking-tighter"
                        placeholder="0.00"
                    />
                </div>
                <div className="w-32 h-px bg-white/5 group-focus-within:bg-orange-500/50 mt-4 transition-colors"></div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between py-1 gap-4">
                <div className="flex justify-between items-center px-6 py-4 bg-[#121216] rounded-xl border border-white/5 hover:bg-[#18181D] transition-colors">
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Lucro Bruto</span>
                    <span className="text-emerald-500 font-mono font-bold text-lg tracking-tight">+ R$ {grossProfit.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center px-6 py-4 bg-[#121216] rounded-xl border border-white/5 hover:bg-[#18181D] transition-colors">
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Prejuízo Bruto</span>
                    <span className="text-rose-500 font-mono font-bold text-lg tracking-tight">- R$ {Math.abs(grossLoss).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center px-6 py-4 bg-orange-500/5 rounded-xl border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.05)] hover:bg-orange-500/10 transition-colors">
                    <div className="flex items-center gap-2">
                        <Percent size={14} className="text-orange-500" />
                        <span className="text-orange-200 text-[10px] uppercase font-bold tracking-widest">Taxas (19%)</span>
                    </div>
                    <span className="text-orange-500 font-mono font-bold text-lg tracking-tight">- R$ {fees.toFixed(2)}</span>
                </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center p-10 bg-gradient-to-br from-[#121216] via-[#0A0A0F] to-black rounded-2xl border border-orange-500/20 shadow-[0_0_40px_rgba(249,115,22,0.15)] relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                 
                 <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 z-10 flex items-center gap-3">
                    Saldo Líquido <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#f97316]"></div>
                 </span>
                 
                 <div className="flex items-baseline justify-center gap-2 text-4xl xl:text-5xl font-bold text-white tracking-tighter mb-6 z-10 relative">
                    <span className="text-2xl text-gray-600 font-normal">R$</span>
                    {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </div>
                 
                 <div className={`text-xs font-mono font-bold px-5 py-2.5 rounded-xl border z-10 flex items-center gap-2 ${currentBalance >= initialCapital ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                    <div className={`w-1 h-1 rounded-full ${currentBalance >= initialCapital ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    PNL: R$ {netPnL >= 0 ? '+' : ''}{netPnL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
