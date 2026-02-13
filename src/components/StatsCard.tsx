
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
}

/**
 * Componente StatsCard para exibição de indicadores financeiros.
 * Segue o padrão Nexus Invest com visual dark e tipografia Outfit.
 */
const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-[#0D0D0D] border border-white/5 p-5 md:p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-primary/40 group shadow-lg">
      {/* Título do Card */}
      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-2 text-gray-500 group-hover:text-primary transition-colors">
        {title}
      </span>
      
      {/* Valor Principal em Destaque */}
      <div className="text-xl md:text-2xl font-bold font-outfit text-white leading-tight break-all">
        {value}
      </div>
      
      {/* Descrição Opcional */}
      {description && (
        <p className="mt-3 text-[9px] md:text-[10px] text-gray-600 uppercase tracking-widest font-semibold leading-relaxed">
          {description}
        </p>
      )}
      
      {/* Efeito de brilho sutil no hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
    </div>
  );
};

export default StatsCard;
