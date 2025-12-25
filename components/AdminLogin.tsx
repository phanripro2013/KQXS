
import React, { useState, useEffect } from 'react';
import { User, Badge } from '../types';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const EXPERT_BADGE: Badge = { id: 'expert', label: 'Cao Thủ', icon: '💎', color: 'bg-blue-500', description: 'Tỷ lệ trúng số cực cao' };
const POPULAR_BADGE: Badge = { id: 'popular', label: 'Thần Tài', icon: '🔥', color: 'bg-orange-500', description: 'Được cộng đồng yêu thích' };

const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // Thông tin quản trị bảo mật
  const ADMIN_USER = "administrator";
  const ADMIN_PASS = "0927099940@Phv";

  useEffect(() => {
    let timer: any;
    if (isLocked && lockTime > 0) {
      timer = setInterval(() => {
        setLockTime((prev) => prev - 1);
      }, 1000);
    } else if (lockTime === 0) {
      setIsLocked(false);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTime]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const adminUser: User = {
        id: 'admin_id_main',
        name: 'Tony Hoài Vũ',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony',
        provider: 'google',
        email: 'tonyhoaivu@gmail.com',
        isActivated: true,
        role: 'admin',
        badges: [EXPERT_BADGE, POPULAR_BADGE],
        reputation: 9999
      };
      onSuccess(adminUser);
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`Sai thông tin quản trị! Còn ${3 - (newAttempts % 3)} lần thử.`);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTime(30);
        setError("Hệ thống bị khóa 30 giây do nhập sai quá nhiều lần!");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-[0_0_100px_rgba(234,179,8,0.3)] overflow-hidden border-4 border-yellow-500 animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-br from-red-800 to-red-950 p-10 text-center border-b-4 border-yellow-500">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-6 shadow-2xl transform rotate-3">
            K
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Hệ Thống Quản Trị</h2>
          <p className="text-yellow-500/80 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Xổ Số Kim Tiền • Secure Access</p>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tài khoản Admin</label>
            <input 
              type="text" 
              required
              disabled={isLocked}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-yellow-500 outline-none transition-all disabled:bg-gray-200"
              placeholder="Nhập User ID..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mật khẩu bảo mật</label>
            <input 
              type="password" 
              required
              disabled={isLocked}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-yellow-500 outline-none transition-all disabled:bg-gray-200"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <div className={`p-4 rounded-xl text-[11px] font-black text-center uppercase tracking-tight animate-bounce ${isLocked ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}>
              {isLocked ? `HỆ THỐNG ĐÃ KHÓA: ${lockTime}s` : error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLocked}
            className="w-full py-5 bg-[#b91c1c] text-white rounded-[24px] font-black text-xs shadow-2xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
          >
            Xác Thực Truy Cập
          </button>
          
          <button 
            type="button"
            onClick={onClose}
            className="w-full text-[10px] font-black text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors"
          >
            Hủy Bỏ
          </button>
        </form>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Shield Core v4.0 • Anti-Intrusion Enabled</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
