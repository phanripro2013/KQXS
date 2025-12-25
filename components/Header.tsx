
import React, { useState } from 'react';
import AdminPanel from './AdminPanel';
import AuthModal from './AuthModal';
import AdminLogin from './AdminLogin';
import { User, Region } from '../types';

interface HeaderProps {
  user: User | null;
  activeRegion: Region;
  onRegionChange: (region: Region) => void;
  onLogin: (user: User, remember: boolean) => void;
  onLogout: () => void;
  onActivate: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, activeRegion, onRegionChange, onLogin, onLogout, onActivate }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isManagement = user?.role === 'admin' || user?.role === 'mod';

  const handleRegionLink = (e: React.MouseEvent, region: Region) => {
    e.preventDefault();
    onRegionChange(region);
    const resultsElement = document.getElementById('results-view');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">K</div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">KIM TIỀN</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Xổ số 3 miền</p>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'MB', name: 'Miền Bắc' },
                { id: 'MN', name: 'Miền Nam' },
                { id: 'MT', name: 'Miền Trung' }
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={(e) => handleRegionLink(e, reg.id as Region)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeRegion === reg.id 
                      ? 'bg-red-50 text-red-600' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {reg.name}
                </button>
              ))}
              <a href="#simulator" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Quay thử</a>
              <a href="#discussion-board" className="px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Thảo luận</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <button 
                onClick={() => setShowAuth(true)} 
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
              >
                Đăng nhập
              </button>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)} 
                  className="flex items-center gap-2 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-200 hover:bg-slate-100 transition-all"
                >
                  <img src={user.avatar} className="w-8 h-8 rounded-full border border-white" alt={user.name} />
                  <span className="text-sm font-bold text-slate-700">{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl border border-slate-100 rounded-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài khoản {user.role}</p>
                    </div>
                    {isManagement && (
                      <button 
                        onClick={() => { setShowAdmin(true); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                      >
                        Quản trị hệ thống
                      </button>
                    )}
                    <button 
                      onClick={onLogout} 
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
            <button 
              onClick={() => setShowAdminLogin(true)} 
              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
              title="Admin Access"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>
          </div>
        </div>
      </header>
      
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} user={user} />}
      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} onSuccess={(adminUser) => { onLogin(adminUser, true); setShowAdmin(true); }} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={onLogin} />}
    </>
  );
};

export default Header;
