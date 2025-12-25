
import React, { useState, useEffect, useMemo } from 'react';
import { generateMockResult } from '../services/mockData';
import { Region, LotteryResult } from '../types';
import { PRIZE_NAMES, LOTTERY_SCHEDULE, WEEKDAYS } from '../constants';

const Simulator: React.FC = () => {
  const [region, setRegion] = useState<Region>('MB');
  const [spinDate, setSpinDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentPrizeText, setCurrentPrizeText] = useState('');

  // Lấy tất cả các tỉnh khả dụng của Miền và Ngày đã chọn
  const availableProvinces = useMemo(() => {
    const dayOfWeek = new Date(spinDate).getDay();
    const provinces = LOTTERY_SCHEDULE[region][dayOfWeek] || [];
    // Miền Bắc thường chỉ có 1 đài chính là Hà Nội hoặc các tỉnh lân cận theo lịch
    return provinces.length > 0 ? provinces : (region === 'MB' ? ['Hà Nội'] : []);
  }, [region, spinDate]);

  const prizeOrderMB = ['seventh', 'sixth', 'fifth', 'fourth', 'third', 'second', 'first', 'special'];
  const prizeOrderMTMN = ['eighth', 'seventh', 'sixth', 'fifth', 'fourth', 'third', 'second', 'first', 'special'];

  const getActiveOrder = (r: Region) => r === 'MB' ? prizeOrderMB : prizeOrderMTMN;

  const startSpin = () => {
    if (availableProvinces.length === 0) return;
    
    setIsSpinning(true);
    setProgress(0);
    setResults([]);
    setCurrentPrizeText('Đang khởi động hệ thống lồng cầu...');
    
    let currentProgress = 0;
    const order = getActiveOrder(region);
    
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      const prizeIndex = Math.floor((currentProgress / 100) * order.length);
      if (prizeIndex < order.length) {
        setCurrentPrizeText(`Đang quay: ${PRIZE_NAMES[order[prizeIndex]]}`);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Tạo kết quả cho TẤT CẢ các tỉnh trong danh sách
        const newResults = availableProvinces.map(province => 
          generateMockResult(region, spinDate, province)
        );
        
        setResults(newResults);
        setIsSpinning(false);
        setCurrentPrizeText('');
      }
    }, 40);
  };

  const renderSingleResultTable = (res: LotteryResult) => {
    const order = [...getActiveOrder(res.region)].reverse();
    
    return (
      <div key={res.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex-1 min-w-[300px]">
        <div className="bg-gray-100 py-2 px-4 border-b border-gray-200 flex justify-between items-center">
          <span className="font-black text-red-600 uppercase text-sm tracking-tighter">{res.province}</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase">{res.region}</span>
        </div>
        <div className="flex flex-col">
          {order.map((key) => {
            const prizes = (res.prizes as any)[key];
            if (!prizes) return null;
            const isSpecial = key === 'special';
            
            return (
              <div key={key} className="flex border-b last:border-0 border-gray-100">
                <div className="w-1/4 bg-gray-50/50 py-2 px-2 text-[9px] font-bold text-gray-400 flex items-center justify-center text-center border-r border-gray-100 uppercase">
                  {PRIZE_NAMES[key]}
                </div>
                <div className={`w-3/4 py-2 px-3 flex flex-wrap justify-center gap-x-3 gap-y-1 items-center ${isSpecial ? 'text-red-600 font-black text-lg' : 'font-bold text-xs sm:text-sm text-gray-700'}`}>
                  {prizes.map((val: string, i: number) => (
                    <span key={i} className="tracking-widest">{val}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const selectedDayName = WEEKDAYS[new Date(spinDate).getDay()];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <span className="text-3xl">🔮</span> QUAY THỬ ĐA ĐÀI
            </h2>
            <p className="text-gray-500 text-sm font-medium italic">Hệ thống quay thử đồng thời tất cả các đài mở thưởng trong ngày</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-xl self-start">
            {['MB', 'MT', 'MN'].map((r) => (
              <button
                key={r}
                onClick={() => !isSpinning && setRegion(r as Region)}
                disabled={isSpinning}
                className={`px-5 py-2 rounded-lg font-black text-xs transition-all ${
                  region === r 
                    ? 'bg-red-600 text-white shadow-md transform scale-105' 
                    : 'text-gray-400 hover:text-gray-600 disabled:opacity-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-1/3 space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Chọn ngày cần quay</label>
            <input
              type="date"
              value={spinDate}
              disabled={isSpinning}
              onChange={(e) => setSpinDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-50"
            />
          </div>
          
          <div className="w-full sm:flex-1 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
             <div className="text-xl">📅</div>
             <div className="flex-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Lịch mở thưởng {selectedDayName}</p>
                <p className="text-xs font-bold text-blue-900">
                  {availableProvinces.length > 0 
                    ? availableProvinces.join(' - ') 
                    : 'Không có tỉnh thành nào mở thưởng trong ngày này'}
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="relative min-h-[450px] bg-[#0f172a] rounded-2xl flex flex-col items-center justify-center overflow-hidden border-4 border-yellow-500 shadow-2xl">
        {!isSpinning && results.length === 0 && (
          <div className="text-center z-10 px-6 py-10">
            <div className="text-7xl mb-8 animate-bounce">🧧</div>
            <h3 className="text-white font-black text-xl mb-2 uppercase tracking-tight">
              Sẵn sàng quay thử {region}
            </h3>
            <p className="text-yellow-400/70 text-xs font-bold mb-8 uppercase tracking-widest">
              {selectedDayName} • {spinDate.split('-').reverse().join('/')}
            </p>
            <button
              onClick={startSpin}
              disabled={availableProvinces.length === 0}
              className="group relative bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-red-900 px-12 py-4 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(234,179,8,0.5)] disabled:opacity-30 disabled:grayscale"
            >
              <span className="relative z-10">BẮT ĐẦU QUAY TẤT CẢ</span>
            </button>
            {availableProvinces.length === 0 && (
              <p className="text-red-400 text-[10px] mt-4 font-bold uppercase italic">Không tìm thấy đài quay cho ngày đã chọn</p>
            )}
          </div>
        )}

        {isSpinning && (
          <div className="text-center w-full px-6 sm:px-20 z-10">
            <div className="text-yellow-400 font-black text-2xl mb-2 tracking-[0.2em] uppercase italic animate-pulse drop-shadow-lg">
              {currentPrizeText}
            </div>
            
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-12 border border-white/5 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-yellow-400 via-white to-yellow-400 h-full transition-all duration-75 shadow-[0_0_20px_rgba(234,179,8,0.8)]" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center">
               {availableProvinces.slice(0, 4).map((prov, idx) => (
                 <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">{prov}</p>
                    <div className="flex justify-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-6 h-8 bg-white/10 rounded flex items-center justify-center text-white font-black text-lg animate-bounce" style={{ animationDelay: `${(idx + i) * 0.1}s` }}>
                          {Math.floor(Math.random()*10)}
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-2">
               <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Hệ thống AI đang giả lập lồng cầu...</p>
            </div>
          </div>
        )}

        {results.length > 0 && !isSpinning && (
          <div className="w-full h-full flex flex-col p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-700 z-10">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-white/10 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400 text-red-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">Kết Quả Quay Thử</div>
                  <div className="flex flex-col">
                    <span className="font-black text-white text-sm uppercase tracking-widest">{region === 'MB' ? 'MIỀN BẮC' : region === 'MT' ? 'MIỀN TRUNG' : 'MIỀN NAM'}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{selectedDayName} • {spinDate.split('-').reverse().join('/')}</span>
                  </div>
                </div>
                <button 
                  onClick={startSpin} 
                  className="w-full sm:w-auto text-[10px] font-black bg-white text-red-600 hover:bg-yellow-400 hover:text-red-900 px-8 py-3 rounded-full transition-all active:scale-95 uppercase tracking-widest shadow-xl"
                >
                  Quay lại lần nữa
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                  {results.map(res => renderSingleResultTable(res))}
                </div>
             </div>

             <div className="mt-4 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl text-[10px] text-yellow-200/80 text-center font-medium leading-relaxed uppercase tracking-tighter">
                * Lưu ý: Đây là chương trình giả lập quay số ngẫu nhiên, kết quả không có giá trị lĩnh thưởng thực tế.
             </div>
          </div>
        )}

        {/* Cinematic Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-600/10 to-transparent"></div>
           <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-400/10 rounded-full blur-[120px]"></div>
           <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]"></div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Simulator;
