
import React, { useState, useEffect } from 'react';
import { User, Badge } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User, remember: boolean) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';
type ForgotStep = 'request' | 'otp' | 'reset';

const EXPERT_BADGE: Badge = { id: 'expert', label: 'Cao Thủ', icon: '💎', color: 'bg-blue-500', description: 'Tỷ lệ trúng số cực cao' };
const POPULAR_BADGE: Badge = { id: 'popular', label: 'Thần Tài', icon: '🔥', color: 'bg-orange-500', description: 'Được cộng đồng yêu thích' };

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(true);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let interval: any;
    if (mode === 'forgot' && forgotStep === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mode, forgotStep, timer]);

  const handleSocialLogin = (provider: User['provider']) => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: provider === 'google' ? 'Tony Hoài Vũ' : 
            provider === 'facebook' ? 'Kim Tiền Member' : 
            provider === 'telegram' ? 'KT VIP' : 'KT User',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
      provider: provider,
      email: `${provider}_user@example.com`,
      isActivated: true,
      role: 'user',
      badges: provider === 'google' ? [EXPERT_BADGE, POPULAR_BADGE] : [],
      reputation: 1000
    };
    onLogin(mockUser, remember);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login' || mode === 'register') {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name || email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name || email}`,
        provider: 'google',
        email: email,
        isActivated: mode === 'login' ? true : false,
        role: 'user',
        badges: [],
        reputation: 0
      };
      onLogin(mockUser, remember);
      onClose();
    }
  };

  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setForgotStep('otp');
      setTimer(60);
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 6) {
      setForgotStep('reset');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      alert("Mật khẩu đã được cập nhật thành công!");
      setMode('login');
      setForgotStep('request');
    } else {
      alert("Mật khẩu xác nhận không khớp!");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 overflow-y-auto py-10">
      <div 
        className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 my-auto border border-white/20">
        
        <div className={`bg-[#b91c1c] p-10 text-center text-white relative overflow-hidden transition-all duration-500 ${mode === 'forgot' ? 'bg-[#1e293b]' : ''}`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <div className="w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          
          <div className={`w-20 h-20 bg-gradient-to-br ${mode === 'forgot' ? 'from-blue-400 to-indigo-600' : 'from-yellow-300 to-yellow-600'} rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-2xl transform rotate-12 relative z-10 transition-all`}>
            {mode === 'forgot' ? '?' : 'K'}
          </div>
          
          <h2 className={`text-2xl font-black uppercase tracking-tighter bg-gradient-to-r ${mode === 'forgot' ? 'from-blue-200 to-blue-400' : 'from-yellow-200 to-yellow-500'} bg-clip-text text-transparent relative z-10`}>
            {mode === 'forgot' ? 'KHÔI PHỤC MẬT KHẨU' : 'XỔ SỐ KIM TIỀN'}
          </h2>
          <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mt-1 relative z-10">
            {mode === 'forgot' ? 'Lấy lại quyền truy cập tài lộc' : 'Gia nhập cộng đồng tài lộc'}
          </p>
        </div>

        {mode !== 'forgot' && (
          <div className="flex bg-gray-50 border-b border-gray-100 p-2">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white text-[#b91c1c] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'register' ? 'bg-white text-[#b91c1c] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Đăng ký
            </button>
          </div>
        )}

        <div className="p-10">
          {mode === 'forgot' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              {forgotStep === 'request' && (
                <form onSubmit={handleForgotRequest} className="space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 font-medium">Vui lòng nhập Email hoặc SĐT đã đăng ký để nhận mã khôi phục.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email / Số điện thoại</label>
                    <input 
                      type="text" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tonyhoaivu@gmail.com hoặc 0927..."
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-blue-500 outline-none transition-all" 
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full py-5 bg-[#1e293b] text-white rounded-[24px] font-black text-xs shadow-2xl hover:bg-black transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Gửi mã xác thực'}
                  </button>
                </form>
              )}

              {forgotStep === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-medium">Mã OTP đã được gửi tới</p>
                    <p className="text-sm font-black text-[#1e293b]">{email}</p>
                  </div>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-16 bg-gray-50 border-2 border-gray-100 rounded-xl text-center text-xl font-black text-[#1e293b] focus:border-blue-500 outline-none transition-all"
                      />
                    ))}
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-[#1e293b] text-white rounded-[24px] font-black text-xs shadow-2xl hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
                  >
                    Xác nhận mã OTP
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <form onSubmit={handleSubmit} className="space-y-5 mb-8">
                {mode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Họ tên của bạn</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Tony Hoài Vũ"
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-yellow-500 outline-none transition-all" 
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email / SĐT tài lộc</label>
                  <input 
                    type="text" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tonyhoaivu@gmail.com"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-yellow-500 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mật khẩu bảo mật</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-yellow-500 outline-none transition-all" 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-[#b91c1c] text-white rounded-[24px] font-black text-xs shadow-2xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest"
                >
                  {mode === 'login' ? 'Khai lộc đăng nhập' : 'Tạo tài khoản Kim Tiền'}
                </button>
              </form>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 p-4 bg-gray-50 border-2 border-gray-100 rounded-[20px] hover:border-yellow-500 transition-all group">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Google</span>
                </button>
                <button onClick={() => handleSocialLogin('facebook')} className="flex items-center justify-center gap-3 p-4 bg-gray-50 border-2 border-gray-100 rounded-[20px] hover:border-yellow-500 transition-all group">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Facebook</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
