
import React from 'react';
// Added missing Info import from lucide-react
import { X, Shield, AlertTriangle, TrendingUp, ShieldCheck, Target, BarChart3, Info } from 'lucide-react';

interface ProfileTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileTypesModal: React.FC<ProfileTypesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0A0A0F] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500 opacity-60"></div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-20 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="overflow-y-auto custom-scrollbar p-8 md:p-12 space-y-10">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-widest">
              <Shield size={12} />
              Gestão de Risco & Estratégia
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Perfis de Investimento</h2>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base max-w-2xl">
              Nossa plataforma oferece quatro perfis de investimento, desenvolvidos para atender diferentes níveis de capital, tolerância a risco e objetivos financeiros. Cada perfil possui uma estratégia específica, com variações em risco, potencial de retorno e retenções para taxas, impostos e custos operacionais.
            </p>
            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex items-start gap-3">
              <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
              <p className="text-orange-200/80 text-xs font-medium italic">
                Importante destacar que todo investimento envolve riscos, e os percentuais de lucro apresentados representam potenciais máximos, não garantias de resultado.
              </p>
            </div>
          </div>

          {/* Grid of Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Perfil de Risco */}
            <div className="group p-6 rounded-[24px] bg-rose-500/[0.03] border border-rose-500/20 hover:bg-rose-500/[0.05] hover:border-rose-500/40 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-rose-500 uppercase tracking-widest text-xs">Perfil de Risco</h3>
                  <p className="text-white font-bold">R$ 1.500 a R$ 3.000</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block">Estratégia</span>
                  <p className="text-gray-300">Operações com alavancagem extremamente elevada, focadas em movimentos rápidos.</p>
                </div>
                <div className="flex justify-between items-center py-2 border-y border-white/5">
                  <span className="text-gray-400">Potencial de Lucro</span>
                  <span className="text-rose-500 font-bold font-mono">até 60%/mês</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Retenção</span>
                  <span className="text-gray-300 font-bold">25% dos lucros</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-300 text-[10px] leading-relaxed">
                  <strong>RISCO:</strong> Possibilidade de perda de até 100% do capital investido. Alta volatilidade.
                </div>
              </div>
            </div>

            {/* Perfil Moderado */}
            <div className="group p-6 rounded-[24px] bg-orange-500/[0.03] border border-orange-500/20 hover:bg-orange-500/[0.05] hover:border-orange-500/40 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-orange-500 uppercase tracking-widest text-xs">Perfil Moderado</h3>
                  <p className="text-white font-bold">R$ 3.000 a R$ 8.000</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block">Estratégia</span>
                  <p className="text-gray-300">Combinação de operações alavancadas e posições defensivas controladas.</p>
                </div>
                <div className="flex justify-between items-center py-2 border-y border-white/5">
                  <span className="text-gray-400">Potencial de Lucro</span>
                  <span className="text-orange-500 font-bold font-mono">até 23%/mês</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Retenção</span>
                  <span className="text-gray-300 font-bold">19% dos lucros</span>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-300 text-[10px] leading-relaxed">
                  <strong>RISCO:</strong> Aproximadamente 25% do capital investido. Equilíbrio entre risco e retorno.
                </div>
              </div>
            </div>

            {/* Perfil Normal */}
            <div className="group p-6 rounded-[24px] bg-amber-500/[0.03] border border-amber-500/20 hover:bg-amber-500/[0.05] hover:border-amber-500/40 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-amber-500 uppercase tracking-widest text-xs">Perfil Normal</h3>
                  <p className="text-white font-bold">R$ 9.000 a R$ 20.000</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block">Estratégia</span>
                  <p className="text-gray-300">Operações conservadoras focadas em consistência e proteção de capital.</p>
                </div>
                <div className="flex justify-between items-center py-2 border-y border-white/5">
                  <span className="text-gray-400">Potencial de Lucro</span>
                  <span className="text-amber-500 font-bold font-mono">até 12%/mês</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Retenção</span>
                  <span className="text-gray-300 font-bold">15% dos lucros</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-300 text-[10px] leading-relaxed">
                  <strong>RISCO:</strong> Estimado em 20% do capital. Maior previsibilidade de ganhos.
                </div>
              </div>
            </div>

            {/* Perfil Cauteloso */}
            <div className="group p-6 rounded-[24px] bg-emerald-500/[0.03] border border-emerald-500/20 hover:bg-emerald-500/[0.05] hover:border-emerald-500/40 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-500 uppercase tracking-widest text-xs">Perfil Cauteloso</h3>
                  <p className="text-white font-bold">R$ 20.000 a R$ 40.000</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block">Estratégia</span>
                  <p className="text-gray-300">Alta proteção e foco no longo prazo. Estabilidade máxima de capital.</p>
                </div>
                <div className="flex justify-between items-center py-2 border-y border-white/5">
                  <span className="text-gray-400">Potencial de Lucro</span>
                  <span className="text-emerald-500 font-bold font-mono">até 8%/mês</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Retenção</span>
                  <span className="text-gray-300 font-bold">10% dos lucros</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-300 text-[10px] leading-relaxed">
                  <strong>RISCO:</strong> Aproximadamente 10% do capital. Prioridade em preservação absoluta.
                </div>
              </div>
            </div>

          </div>

          {/* Footer Considerations */}
          <div className="p-8 rounded-[24px] bg-white/[0.02] border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Info size={18} className="text-orange-500" />
              Considerações Importantes
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                Os percentuais de lucro apresentados são estimativas máximas, não garantias.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                O mercado financeiro está sujeito a fatores externos e imprevisíveis.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                Avalie seu perfil financeiro e objetivos antes de selecionar sua estratégia.
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                Recomendamos investir apenas valores que não comprometam sua estabilidade.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTypesModal;
