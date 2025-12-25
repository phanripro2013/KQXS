
import React, { useState, useEffect } from 'react';
import { User, Badge } from '../types';

interface PresenceBarProps {
  currentUser: User | null;
}

const EXPERT_BADGE: Badge = { id: 'expert', label: 'Cao Thủ', icon: '💎', color: 'bg-blue-500', description: 'Tỷ lệ trúng số cực cao' };
const POPULAR_BADGE: Badge = { id: 'popular', label: 'Thần Tài', icon: '🔥', color: 'bg-orange-500', description: 'Được cộng đồng yêu thích' };
const ACTIVE_BADGE: Badge = { id: 'active', label: 'Năng Nổ', icon: '⭐', color: 'bg-green-500', description: 'Tích cực đóng góp ý kiến' };

const PresenceBar: React.FC<PresenceBarProps> = ({ currentUser }) => {
  const [counts, setCounts] = useState({
    total: 1245,
    members: 82,
    guests: 1163
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => {
        const diff = Math.floor(Math.random() * 5) - 2;
        const newTotal = Math.max(1000, prev.total + diff);
        const newMembers = Math.max(50, prev.members + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0));
        return {
          total: newTotal,
          members: newMembers,
          guests: newTotal - newMembers
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onlineMembers = [
    { id: '1', name: 'Tony Hoài Vũ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony', badges: [EXPERT_BADGE, POPULAR_BADGE] },
    { id: '2', name: 'Hữu lộc', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Loc', badges: [POPULAR_BADGE] },
    { id: '3', name: 'Minh Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', badges: [ACTIVE_BADGE] },
    { id: '4', name: 'Thần tài 79', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky', badges: [EXPERT_BADGE] },
    { id: '5', name: 'Bé Ba', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ba', badges: [] },
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-3 shadow-sm overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đang trực tuyến:</span>
            <span className="text-sm font-black text-gray-900">{counts.total.toLocaleString()}</span>
          </div>
          
          <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
          
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-tight">
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
               <span className="text-gray-500">Thành viên:</span>
               <span className="text-blue-600">{counts.members}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
               <span className="text-gray-500">Khách:</span>
               <span className="text-gray-700">{counts.guests.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest hidden lg:block">Cao thủ đang online:</span>
          <div className="flex -space-x-2">
            {onlineMembers.map((member) => (
              <div 
                key={member.id} 
                className="relative group cursor-help"
                title={`${member.name} ${member.badges.map(b => b.icon).join('')}`}
              >
                <img 
                  src={member.avatar} 
                  className={`w-7 h-7 rounded-full border-2 bg-gray-100 shadow-sm ${member.badges.some(b => b.id === 'expert') ? 'border-blue-400' : 'border-white'}`} 
                  alt={member.name} 
                />
                {member.badges.length > 0 && (
                   <span className="absolute -top-1 -right-1 text-[8px] filter drop-shadow-sm">{member.badges[0].icon}</span>
                )}
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></span>
              </div>
            ))}
            {currentUser && !onlineMembers.find(m => m.id === currentUser.id) && (
              <div className="relative group cursor-help" title={`Bạn (${currentUser.name})`}>
                <img 
                  src={currentUser.avatar} 
                  className="w-7 h-7 rounded-full border-2 border-yellow-500 bg-yellow-50 shadow-sm" 
                  alt="You" 
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></span>
              </div>
            )}
            <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-400 shadow-sm">
              +{counts.members - 5}
            </div>
          </div>
        </div>

        <div className="hidden xl:block bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-100">
           <p className="text-[10px] font-black text-yellow-700 uppercase tracking-tight">
             ⚡ <span className="animate-pulse">Thông báo:</span> <span className="text-red-600">Thành viên {onlineMembers[0].name} vừa dự đoán chính xác Giải Đặc Biệt!</span>
           </p>
        </div>

      </div>
    </div>
  );
};

export default PresenceBar;
