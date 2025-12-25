
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import PresenceBar from './components/PresenceBar';
import LotteryDisplay from './components/LotteryDisplay';
import Simulator from './components/Simulator';
import PredictionAI from './components/PredictionAI';
import FortuneTeller from './components/FortuneTeller';
import DiscussionBoard from './components/DiscussionBoard';
import AdBanner from './components/AdBanner';
import AuthModal from './components/AuthModal';
import ShareMenu from './components/ShareMenu';
import { getHistoricalResults } from './services/mockData';
import { LotteryResult, Region, User } from './types';
import { REGIONS, WEEKDAYS, LOTTERY_SCHEDULE } from './constants';

const App: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState<Region>('MB');
  const [allResults, setAllResults] = useState<LotteryResult[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const results = getHistoricalResults(30);
    setAllResults(results);
    
    const savedUser = localStorage.getItem('lotto360_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newUser: User, remember: boolean) => {
    setUser(newUser);
    if (remember) {
      localStorage.setItem('lotto360_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('lotto360_user');
    }
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lotto360_user');
  };

  const handleActivateAccount = () => {
    if (user) {
      const activatedUser = { ...user, isActivated: true };
      setUser(activatedUser);
      localStorage.setItem('lotto360_user', JSON.stringify(activatedUser));
      alert("Đã kích hoạt tài khoản!");
    }
  };

  const filteredResults = useMemo(() => {
    return allResults.filter(r => r.region === activeRegion && r.date === selectedDate);
  }, [allResults, activeRegion, selectedDate]);

  const handleRegionChange = (region: Region) => {
    setActiveRegion(region);
  };

  const scrollToSection = (id: string, region?: Region) => {
    if (region) {
      setActiveRegion(region);
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header 
        user={user} 
        activeRegion={activeRegion}
        onRegionChange={handleRegionChange}
        onLogin={handleLogin} 
        onLogout={handleLogout} 
        onActivate={handleActivateAccount} 
      />
      <PresenceBar currentUser={user} />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <AdBanner type="leaderboard" />

        {/* Khu vực kết quả */}
        <section id="results-view" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              {REGIONS.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setActiveRegion(reg.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                    activeRegion === reg.id 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {reg.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-white px-6 py-2.5 rounded-2xl shadow-sm border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase">Ngày xem:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm font-bold text-slate-700 outline-none cursor-pointer bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {filteredResults.length > 0 ? (
                filteredResults.map((res) => (
                  <LotteryDisplay key={res.id} result={res} />
                ))
              ) : (
                <div className="bg-white rounded-[32px] p-20 text-center border border-slate-100 shadow-sm">
                  <div className="text-6xl mb-6">📅</div>
                  <h3 className="text-xl font-black text-slate-800 uppercase">Đang cập nhật...</h3>
                  <p className="text-slate-400 text-sm mt-2">Dữ liệu cho ngày đã chọn hiện chưa khả dụng.</p>
                </div>
              )}
            </div>

            <aside className="space-y-8">
               <div id="ai-chat" className="scroll-mt-24">
                  <PredictionAI />
               </div>
               <div id="fortune-tell" className="scroll-mt-24">
                  <FortuneTeller />
               </div>
               <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-red-600 rounded-full"></span> Lịch quay thưởng
                  </h3>
                  <div className="space-y-4">
                    {REGIONS.map(reg => {
                      const day = new Date(selectedDate).getDay();
                      const provinces = LOTTERY_SCHEDULE[reg.id][day] || [];
                      return (
                        <div key={reg.id} className="pb-3 border-b border-slate-50 last:border-0">
                          <p className="text-[10px] font-black text-red-600 uppercase mb-1">{reg.name}</p>
                          <p className="text-xs font-bold text-slate-600">{provinces.join(', ') || 'N/A'}</p>
                        </div>
                      )
                    })}
                  </div>
               </div>
            </aside>
          </div>
        </section>

        <section id="simulator" className="scroll-mt-24">
          <Simulator />
        </section>

        <section id="discussion-board" className="scroll-mt-24">
          <DiscussionBoard user={user} onAuthRequired={() => setShowAuthModal(true)} />
        </section>

        {/* Chia sẻ ứng dụng */}
        <section className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-xl text-center space-y-8 overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Chia sẻ ứng dụng Kim Tiền</h2>
            <p className="text-slate-400 text-sm font-medium mt-2">Đừng giữ may mắn cho riêng mình, hãy lan tỏa tài lộc đến bạn bè!</p>
          </div>
          <div className="max-w-md mx-auto">
            <ShareMenu 
              url={window.location.origin}
              title="Tra cứu kết quả xổ số nhanh nhất tại Xổ Số Kim Tiền"
              variant="inline"
            />
          </div>
        </section>

        <AdBanner type="leaderboard" label="LIÊN HỆ QUẢNG CÁO: 0927.099.940" />
      </main>

      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-sm">
               <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-6">K</div>
               <h2 className="text-2xl font-black tracking-tighter mb-4">XỔ SỐ KIM TIỀN</h2>
               <p className="text-slate-400 text-sm leading-relaxed">Hệ thống tra cứu kết quả xổ số 3 miền trực tuyến, nhanh nhất, chính xác nhất và hoàn toàn miễn phí.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Kết quả XS</h4>
                  <ul className="text-sm font-bold text-slate-300 space-y-2">
                    <li><button onClick={() => scrollToSection('results-view', 'MB')} className="hover:text-red-500 transition-colors">Kết quả miền Bắc</button></li>
                    <li><button onClick={() => scrollToSection('results-view', 'MN')} className="hover:text-red-500 transition-colors">Kết quả miền Nam</button></li>
                    <li><button onClick={() => scrollToSection('results-view', 'MT')} className="hover:text-red-500 transition-colors">Kết quả miền Trung</button></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Tiện ích</h4>
                  <ul className="text-sm font-bold text-slate-300 space-y-2">
                    <li><button onClick={() => scrollToSection('discussion-board')} className="hover:text-red-500 transition-colors">Thảo luận số</button></li>
                    <li><button onClick={() => scrollToSection('ai-chat')} className="hover:text-red-500 transition-colors">Soi cầu AI</button></li>
                    <li><button onClick={() => scrollToSection('simulator')} className="hover:text-red-500 transition-colors">Quay thử may mắn</button></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-500">Thông tin</h4>
                  <ul className="text-sm font-bold text-slate-300 space-y-2">
                    <li><a href="tel:0927099940" className="hover:text-red-500 transition-colors">Liên hệ hỗ trợ</a></li>
                    <li><button onClick={() => scrollToSection('fortune-tell')} className="hover:text-red-500 transition-colors">Xin quẻ tài lộc</button></li>
                    <li><a href="#" className="hover:text-red-500 transition-colors">Chính sách</a></li>
                  </ul>
               </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-10 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">© 2024 LOTTERY KIM TIEN • CRAFTED WITH PRIDE</p>
          </div>
        </div>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
    </div>
  );
};

export default App;
