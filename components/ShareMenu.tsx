
import React, { useState } from 'react';

interface ShareMenuProps {
  url: string;
  title: string;
  onClose?: () => void;
  variant?: 'inline' | 'modal';
}

const ShareMenu: React.FC<ShareMenuProps> = ({ url, title, onClose, variant = 'modal' }) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: 'https://www.svgrepo.com/show/475647/facebook-color.svg',
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877F2]'
    },
    {
      name: 'Zalo',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png',
      link: `https://sp.zalo.me/share?url=${encodedUrl}`,
      color: 'bg-[#0068FF]'
    },
    {
      name: 'Telegram',
      icon: 'https://www.svgrepo.com/show/475689/telegram-color.svg',
      link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#26A5E4]'
    },
    {
      name: 'Line',
      icon: 'https://www.svgrepo.com/show/475664/line-color.svg',
      link: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
      color: 'bg-[#00C300]'
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div className={`${variant === 'modal' ? 'p-6' : 'p-2'} space-y-4`}>
      {variant === 'modal' && (
        <div className="text-center mb-6">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Chia sẻ tài lộc</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Lan tỏa con số may mắn đến bạn bè</p>
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-4">
        {shareLinks.map((platform) => (
          <a
            key={platform.name}
            href={platform.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-active:scale-95 bg-white border border-slate-100`}>
              <img src={platform.icon} className="w-6 h-6" alt={platform.name} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{platform.name}</span>
          </a>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="relative flex items-center">
          <input 
            type="text" 
            readOnly 
            value={url} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-500 pr-24"
          />
          <button 
            onClick={copyToClipboard}
            className={`absolute right-1.5 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {copied ? 'Đã chép' : 'Sao chép'}
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === 'inline') return content;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xs rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white/20">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        {content}
      </div>
    </div>
  );
};

export default ShareMenu;
