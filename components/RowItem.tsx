
import React, { memo } from 'react';
import { DayEntry, Sentiment, HighlightStatus } from '../types';
import StarRating from './StarRating';
import { Smile, Frown, Meh, ArrowUp, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface RowItemProps {
  entry: DayEntry;
  onUpdate: (id: number, field: keyof DayEntry, value: any) => void;
}

const RowItem: React.FC<RowItemProps> = ({ entry, onUpdate }) => {
  
  // Highlight Logic
  const getContainerStyle = () => {
    const base = "group rounded-2xl border transition-all p-4 md:p-0 md:grid md:grid-cols-12 md:gap-4 md:items-center relative mb-3 ";
    switch (entry.highlight) {
      case 'red': return base + "bg-rose-500/5 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
      case 'orange': return base + "bg-orange-500/5 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]";
      case 'green': return base + "bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
      default: return base + "bg-[#121216] border-white/5 hover:border-orange-500/20 hover:shadow-[0_0_15px_rgba(249,115,22,0.05)]";
    }
  };

  const getButtonClass = (type: Sentiment, current: Sentiment) => {
    const base = "flex items-center justify-center w-full h-8 rounded-lg text-[9px] font-bold transition-all duration-200 border uppercase tracking-tighter gap-1 ";
    if (type === current) {
      if (type === 'negative') return base + "bg-rose-500 text-white border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]";
      if (type === 'neutral') return base + "bg-gray-500 text-white border-gray-500/50";
      if (type === 'positive') return base + "bg-emerald-500 text-white border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
    }
    return base + "bg-[#18181B] text-gray-500 border-transparent hover:bg-[#27272A] hover:text-gray-300";
  };

  const toggleHighlight = (status: HighlightStatus) => {
    if (entry.highlight === status) {
      onUpdate(entry.id, 'highlight', null);
    } else {
      onUpdate(entry.id, 'highlight', status);
    }
  };

  const toggleSentiment = (type: Sentiment) => {
    if (entry.sentiment === type) {
        onUpdate(entry.id, 'sentiment', null);
    } else {
        onUpdate(entry.id, 'sentiment', type);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'dailyValue' | 'maxValue') => {
    const val = parseFloat(e.target.value);
    onUpdate(entry.id, field, isNaN(val) ? 0 : val);
  };

  return (
    <div className={getContainerStyle()}>
      
      {/* Mobile Header */}
      <div className="flex justify-between items-center md:hidden mb-4">
        <span className="font-bold text-gray-400">{entry.dayLabel}</span>
        <div className="text-xs font-mono text-gray-600">ID: #{entry.id + 1}</div>
      </div>

      {/* 1. Day Label (Desktop) */}
      <div className="hidden md:flex col-span-1 justify-center">
         <div className="bg-[#18181B] text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full border border-white/5">
            {entry.dayLabel}
         </div>
      </div>

      {/* 2. Values: Result & Max */}
      <div className="md:col-span-3 grid grid-cols-2 gap-2 px-2">
         {/* Daily Value */}
         <div className="relative group/input">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-600 text-[10px]">R$</span>
             </div>
             <input
                type="number"
                value={entry.dailyValue === 0 ? '' : entry.dailyValue}
                onChange={(e) => handleValueChange(e, 'dailyValue')}
                placeholder="0.00"
                className={`w-full bg-[#0A0A0F] border border-white/5 rounded-xl py-2 pl-8 pr-2 text-xs font-mono focus:outline-none focus:border-orange-500/30 transition-colors placeholder-gray-800 ${
                    entry.dailyValue > 0 ? 'text-emerald-500' : 
                    entry.dailyValue < 0 ? 'text-rose-500' : 
                    'text-gray-400'
                }`}
             />
         </div>
         {/* Max Value */}
         <div className="relative group/input">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowUp size={10} className="text-gray-600" />
             </div>
             <input
                type="number"
                value={entry.maxValue === 0 ? '' : entry.maxValue}
                onChange={(e) => handleValueChange(e, 'maxValue')}
                placeholder="Max"
                className="w-full bg-[#0A0A0F] border border-white/5 rounded-xl py-2 pl-8 pr-2 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500/30 transition-colors placeholder-gray-800"
             />
         </div>
      </div>

      {/* 3. Sentiment Buttons (with Text labels as requested) */}
      <div className="md:col-span-3 flex gap-1.5 px-2 my-3 md:my-0">
        <button 
          onClick={() => toggleSentiment('negative')}
          className={getButtonClass('negative', entry.sentiment)}
        >
          <Frown size={11} /> NEGATIVO
        </button>
        <button 
          onClick={() => toggleSentiment('neutral')}
          className={getButtonClass('neutral', entry.sentiment)}
        >
          <Meh size={11} /> NEUTRO
        </button>
        <button 
          onClick={() => toggleSentiment('positive')}
          className={getButtonClass('positive', entry.sentiment)}
        >
          <Smile size={11} /> POSITIVO
        </button>
      </div>

      {/* 4. Highlight Status Controls */}
      <div className="md:col-span-1 flex justify-center gap-1.5">
         <button 
            onClick={() => toggleHighlight('red')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${entry.highlight === 'red' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30' : 'bg-[#18181B] text-gray-600 border-transparent hover:border-rose-500/50'}`}
            title="Ultrapassou limite de perda"
         >
             <AlertCircle size={12} />
         </button>
         <button 
            onClick={() => toggleHighlight('orange')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${entry.highlight === 'orange' ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30' : 'bg-[#18181B] text-gray-600 border-transparent hover:border-orange-500/50'}`}
            title="Teve lucro e devolveu"
         >
             <RefreshCw size={12} />
         </button>
         <button 
            onClick={() => toggleHighlight('green')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${entry.highlight === 'green' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-[#18181B] text-gray-600 border-transparent hover:border-emerald-500/50'}`}
            title="Ganhou e manteve"
         >
             <CheckCircle2 size={12} />
         </button>
      </div>

      {/* 5. Note Input */}
      <div className="md:col-span-2 px-2">
         <input
          type="text"
          value={entry.note}
          onChange={(e) => onUpdate(entry.id, 'note', e.target.value)}
          placeholder="Análise do dia..."
          className="w-full bg-transparent border-b border-white/5 px-2 py-2 text-xs text-gray-300 placeholder-gray-700 focus:outline-none focus:border-orange-500/50 transition-colors"
        />
      </div>

      {/* 6. Star Rating */}
      <div className="md:col-span-2 flex justify-end mt-3 md:mt-0 px-2">
         <StarRating rating={entry.rating} onChange={(val) => onUpdate(entry.id, 'rating', val)} />
      </div>

    </div>
  );
};

export default memo(RowItem);
