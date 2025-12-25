
import React from 'react';

interface AdProps {
  type: 'leaderboard' | 'rectangle' | 'skyscraper' | 'infeed';
  label?: string;
}

const AdBanner: React.FC<AdProps> = ({ type, label = 'QUẢNG CÁO' }) => {
  const getStyles = () => {
    switch (type) {
      case 'leaderboard':
        return 'w-full h-[90px] sm:h-[120px]';
      case 'skyscraper':
        return 'w-full h-[600px]';
      case 'rectangle':
        return 'w-full h-[250px]';
      case 'infeed':
        return 'w-full h-[150px] my-6';
      default:
        return 'w-full h-[90px]';
    }
  };

  return (
    <div className={`relative bg-gray-100 border border-gray-200 rounded-xl flex flex-col items-center justify-center overflow-hidden group ${getStyles()}`}>
      {/* Ad Label */}
      <div className="absolute top-0 right-0 bg-gray-200/50 px-2 py-0.5 rounded-bl-lg">
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      
      {/* Close Button Placeholder */}
      <button className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Mock Ad Content */}
      <div className="text-center p-4">
        <div className="text-gray-300 font-black text-xl mb-1 uppercase tracking-tighter italic opacity-50">Google AdSense</div>
        <p className="text-[10px] text-gray-400 font-medium">Vị trí đặt mã quảng cáo của bạn</p>
        <div className="mt-2 text-[9px] text-blue-500 font-bold hover:underline cursor-pointer">Tìm hiểu thêm</div>
      </div>

      {/* Decorative Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};

export default AdBanner;
