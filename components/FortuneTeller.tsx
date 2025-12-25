
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const FortuneTeller: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState<{
    numbers: string[];
    description: string;
    luckyColor: string;
    direction: string;
  } | null>(null);

  const getFortune = async () => {
    if (!birthDate) return;
    setLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const today = new Date().toLocaleDateString('vi-VN');
      
      const prompt = `Tôi sinh ngày ${birthDate}. Hôm nay là ngày ${today}. 
      Hãy đóng vai một chuyên gia tử vi và phong thủy, hãy:
      1. Phân tích ngắn gọn vận hạn may mắn của tôi hôm nay.
      2. Cho tôi 4 con số may mắn (từ 00-99) để lấy lộc đầu năm/đầu tháng.
      3. Gợi ý màu sắc may mắn và hướng xuất hành.
      Trả lời dưới dạng JSON với cấu trúc: {"numbers": ["xx", "yy", ...], "description": "...", "luckyColor": "...", "direction": "..."}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      setFortune(data);
    } catch (error) {
      console.error("Lỗi lấy quẻ bói:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden border border-white/10 group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.85 8.65L22 9.24L16.5 13.97L18.18 21L12 17.27L5.82 21L7.5 13.97L2 9.24L9.15 8.65L12 2Z"/></svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-black italic tracking-tighter mb-1 flex items-center gap-2">
          <span className="text-2xl">✨</span> PHONG THỦY CẢI VẬN
        </h3>
        <p className="text-[10px] text-purple-200 uppercase font-bold tracking-[0.2em] mb-6">Tử vi số học & Vận mệnh hàng ngày</p>

        {!fortune ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-purple-300 uppercase px-1">Nhập ngày sinh của bạn</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              />
            </div>
            <button
              onClick={getFortune}
              disabled={loading || !birthDate}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-black py-4 rounded-xl shadow-lg shadow-yellow-400/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
              ) : "XEM QUẺ NGAY"}
            </button>
            <p className="text-[9px] text-center text-purple-300/60 italic mt-2">Dữ liệu được phân tích bởi AI dựa trên thuật số học</p>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-5">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-xs leading-relaxed text-purple-100 italic">"{fortune.description}"</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <p className="text-[9px] text-purple-300 uppercase font-bold mb-1">Màu may mắn</p>
                <p className="text-xs font-black">{fortune.luckyColor}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <p className="text-[9px] text-purple-300 uppercase font-bold mb-1">Hướng xuất hành</p>
                <p className="text-xs font-black">{fortune.direction}</p>
              </div>
            </div>

            <div className="text-center space-y-3">
              <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Bộ số đại cát hôm nay</p>
              <div className="flex justify-center gap-3">
                {fortune.numbers.map((num, i) => (
                  <div key={i} className="w-12 h-12 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-purple-900 font-black text-xl shadow-xl border-2 border-white/20">
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setFortune(null)}
              className="w-full mt-4 text-[10px] font-black text-purple-300 hover:text-white uppercase tracking-widest transition-colors"
            >
              Thử ngày sinh khác
            </button>
          </div>
        )}
      </div>
      
      {/* Animated stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-white rounded-full animate-ping delay-700"></div>
      </div>
    </div>
  );
};

export default FortuneTeller;
