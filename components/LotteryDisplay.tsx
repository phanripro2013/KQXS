
import React from 'react';
import { LotteryResult } from '../types';
import { PRIZE_NAMES, WEEKDAYS } from '../constants';

interface Props {
  result: LotteryResult;
}

const LotteryDisplay: React.FC<Props> = ({ result }) => {
  const dateObj = new Date(result.date);
  const dayName = WEEKDAYS[dateObj.getDay()];

  const renderPrizeGroup = (key: string, values: string[] | undefined) => {
    if (!values || values.length === 0) return null;
    const isSpecial = key === 'special';
    
    return (
      <div key={key} className={`flex flex-col sm:flex-row items-center border-b border-slate-100 last:border-0 py-3 sm:py-4 px-4 sm:px-6 transition-colors hover:bg-slate-50/50`}>
        <div className="w-full sm:w-1/4 mb-2 sm:mb-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{PRIZE_NAMES[key]}</span>
        </div>
        <div className="w-full sm:w-3/4 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
          {values.map((v, i) => (
            <span 
              key={i} 
              className={`tracking-[0.15em] font-black ${
                isSpecial 
                  ? 'text-3xl sm:text-4xl text-red-600 drop-shadow-sm' 
                  : 'text-xl text-slate-700'
              }`}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const prizeOrder = ['special', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];

  return (
    <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group hover:border-red-200 transition-all duration-300">
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {result.province ? `Xổ Số ${result.province}` : `Xổ Số ${result.region}`}
          </h2>
          <div className="flex items-center gap-2 mt-1 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <p className="text-xs font-bold uppercase tracking-widest">{dayName}, {result.date.split('-').reverse().join('/')}</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
          <span className="text-[10px] font-black uppercase tracking-widest">{result.region === 'MB' ? 'Miền Bắc' : result.region === 'MN' ? 'Miền Nam' : 'Miền Trung'}</span>
        </div>
      </div>
      
      <div className="flex flex-col">
        {prizeOrder.map(key => renderPrizeGroup(key, (result.prizes as any)[key]))}
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center gap-6">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase">Trạng thái:</span>
           <span className="text-[10px] font-black text-green-600 uppercase flex items-center gap-1">
             <span className="w-1 h-1 rounded-full bg-green-500"></span> Đã khóa sổ
           </span>
        </div>
        <button className="text-[10px] font-black text-red-600 uppercase hover:underline">In kết quả</button>
      </div>
    </div>
  );
};

export default LotteryDisplay;
