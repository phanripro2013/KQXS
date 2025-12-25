
import React, { useState } from 'react';
import { User } from '../types';

interface Member {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'banned' | 'pending';
  role: string;
  joinDate: string;
}

interface AdCampaign {
  id: string;
  title: string;
  type: string;
  status: 'running' | 'paused';
  clicks: number;
}

const AdminPanel: React.FC<{ onClose: () => void, user: User | null }> = ({ onClose, user }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'ads' | 'members' | 'security'>('stats');
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Nguyễn Văn A', email: 'anv@gmail.com', status: 'active', role: 'user', joinDate: '2023-10-01' },
    { id: '2', name: 'Trần Thị B', email: 'btt@gmail.com', status: 'active', role: 'user', joinDate: '2023-11-15' },
    { id: '3', name: 'Minh Kiểm Soát', email: 'minhmod@gmail.com', status: 'active', role: 'mod', joinDate: '2024-01-20' },
  ]);
  const [ads, setAds] = useState<AdCampaign[]>([
    { id: 'ad1', title: 'Banner Kim Tiền Tết 2025', type: 'Leaderboard', status: 'running', clicks: 1250 },
    { id: 'ad2', title: 'Khuyến mãi Soi Cầu AI', type: 'Rectangle', status: 'paused', clicks: 840 },
  ]);

  const isAdmin = user?.role === 'admin';

  const toggleMemberStatus = (id: string) => {
    if (!isAdmin) {
      alert("Hành động bị từ chối: Chỉ Administrator mới có quyền khóa/mở khóa hội viên.");
      return;
    }
    setMembers(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 'active' ? 'banned' : 'active' } : m
    ));
  };

  const deleteMember = (id: string) => {
    if (!isAdmin) {
      alert("Hành động bị từ chối: Chỉ Administrator mới có quyền xóa hội viên vĩnh viễn.");
      return;
    }
    if (window.confirm("Bạn có chắc chắn muốn xóa hội viên này?")) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col md:flex-row animate-in fade-in duration-300">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-[#0f172a] border-r border-yellow-500/20 flex flex-col shadow-2xl">
        <div className="p-10 border-b border-white/5">
          <div className="flex items-center gap-4 mb-4">
             <div className="bg-gradient-to-br from-yellow-400 to-yellow-700 w-12 h-12 rounded-2xl text-[#0f172a] font-black text-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">K</div>
             <div>
                <span className="text-white font-black tracking-tighter text-lg block uppercase">{user?.role === 'admin' ? 'Admin Core' : 'Mod Desk'}</span>
                <span className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.2em]">Hệ thống Kim Tiền</span>
             </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Đang đăng nhập</p>
             <p className="text-xs font-black text-white italic">{user?.name}</p>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'stats' ? 'bg-yellow-500 text-[#0f172a] shadow-xl' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <span>📈</span> Thống kê
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'members' ? 'bg-yellow-500 text-[#0f172a] shadow-xl' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <span>👥</span> Hội viên
          </button>
          <button 
            onClick={() => setActiveTab('ads')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'ads' ? 'bg-yellow-500 text-[#0f172a] shadow-xl' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <span>🧧</span> Quảng cáo
          </button>
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'security' ? 'bg-red-600 text-white shadow-xl' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <span>🛡️</span> Bảo mật Hệ thống
            </button>
          )}
        </nav>

        <div className="p-8 border-t border-white/5">
          <button onClick={onClose} className="w-full py-4 bg-gray-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-700 transition-all">
            Quay lại ứng dụng
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              {activeTab === 'stats' && 'Tổng quan hệ thống'}
              {activeTab === 'members' && 'Danh sách hội viên'}
              {activeTab === 'ads' && 'Chiến dịch quảng cáo'}
              {activeTab === 'security' && 'Cấu hình bảo mật'}
            </h2>
            <p className="text-gray-400 text-sm font-bold mt-2">Truy cập cấp độ: <span className="text-yellow-500 underline uppercase">{user?.role}</span></p>
          </div>
        </header>

        {activeTab === 'members' && (
          <div className="bg-white/5 rounded-[32px] border border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center">
                <h3 className="text-white font-black uppercase text-xs tracking-widest">Hội viên hệ thống</h3>
                {!isAdmin && <span className="text-[10px] text-yellow-500 font-black uppercase bg-yellow-500/10 px-3 py-1 rounded-full">Chỉ xem</span>}
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-400">
                  <thead className="bg-black/20 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                    <tr>
                      <th className="px-8 py-6">Thành viên</th>
                      <th className="px-8 py-6">Vai trò</th>
                      <th className="px-8 py-6">Trạng thái</th>
                      <th className="px-8 py-6 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {members.map(m => (
                      <tr key={m.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-white font-black">{m.name}</p>
                          <p className="text-[10px] opacity-50">{m.email}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-2 py-1 rounded uppercase font-black text-[9px] ${m.role === 'admin' ? 'bg-red-500/20 text-red-500' : m.role === 'mod' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-400'}`}>
                             {m.role}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`flex items-center gap-1.5 ${m.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="font-black uppercase">{m.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</span>
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <button 
                               onClick={() => toggleMemberStatus(m.id)}
                               disabled={!isAdmin || m.role === 'admin'}
                               className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isAdmin || m.role === 'admin' ? 'opacity-20 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-yellow-500 hover:text-black'}`}
                             >
                               {m.status === 'active' ? 'Khóa' : 'Mở khóa'}
                             </button>
                             {isAdmin && m.role !== 'admin' && (
                               <button 
                                 onClick={() => deleteMember(m.id)}
                                 className="px-4 py-2 bg-red-600/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                               >
                                 Xóa
                               </button>
                             )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-yellow-500/30 transition-all group">
               <p className="text-gray-500 text-[10px] font-black uppercase mb-1 tracking-widest group-hover:text-yellow-500 transition-colors">Thành viên mới</p>
               <span className="text-5xl font-black text-white tracking-tighter">+450</span>
            </div>
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-yellow-500/30 transition-all group">
               <p className="text-gray-500 text-[10px] font-black uppercase mb-1 tracking-widest group-hover:text-yellow-500 transition-colors">Yêu cầu duyệt bài</p>
               <span className="text-5xl font-black text-white tracking-tighter">12</span>
            </div>
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-yellow-500/30 transition-all group">
               <p className="text-gray-500 text-[10px] font-black uppercase mb-1 tracking-widest group-hover:text-yellow-500 transition-colors">Lượt truy cập</p>
               <span className="text-5xl font-black text-white tracking-tighter">1.2M</span>
            </div>
          </div>
        )}
        
        {/* Placeholder for security tab (only accessible to admin via sidebar filter) */}
        {isAdmin && activeTab === 'security' && (
          <div className="bg-red-900/10 border border-red-500/20 p-12 rounded-[40px] animate-in zoom-in-95 duration-500">
             <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-4 italic">Bảng Điều Khiển An Ninh Tối Cao</h3>
             <p className="text-gray-400 mb-8 max-w-2xl">Administrator có quyền truy cập vào nhật ký IP, cấu hình API Gemini và các chế độ bảo mật khẩn cấp của hệ thống Xổ Số Kim Tiền.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="py-4 px-6 bg-red-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-red-600/20">Chế độ Khẩn cấp (Shutdown)</button>
                <button className="py-4 px-6 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase text-xs">Xem nhật ký IP (Log)</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
