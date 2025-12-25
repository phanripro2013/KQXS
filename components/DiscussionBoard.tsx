
import React, { useState, useMemo } from 'react';
import { Region, User, Badge, UserRole } from '../types';
import { REGIONS, WEEKDAYS, LOTTERY_SCHEDULE } from '../constants';
import ShareMenu from './ShareMenu';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadges: Badge[];
  authorRole: UserRole;
  region: Region;
  day: number;
  province: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  isLocked: boolean;
  allowComments: boolean;
  commentCount: number;
  status: 'pending' | 'approved';
}

interface DiscussionBoardProps {
  user: User | null;
  onAuthRequired: () => void;
}

const EXPERT_BADGE: Badge = { id: 'expert', label: 'Cao Thủ', icon: '💎', color: 'bg-blue-500', description: 'Tỷ lệ trúng số cực cao' };
const POPULAR_BADGE: Badge = { id: 'popular', label: 'Thần Tài', icon: '🔥', color: 'bg-orange-500', description: 'Được cộng đồng yêu thích' };
const ACTIVE_BADGE: Badge = { id: 'active', label: 'Năng Nổ', icon: '⭐', color: 'bg-green-500', description: 'Tích cực đóng góp ý kiến' };

const DiscussionBoard: React.FC<DiscussionBoardProps> = ({ user, onAuthRequired }) => {
  const [activeRegion, setActiveRegion] = useState<Region>('MB');
  const [activeDay, setActiveDay] = useState<number>(new Date().getDay());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [activationError, setActivationError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending'>('all');
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      authorId: 'admin_id',
      authorName: 'Tony Hoài Vũ',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony',
      authorBadges: [EXPERT_BADGE, POPULAR_BADGE],
      authorRole: 'admin',
      region: 'MB',
      day: new Date().getDay(),
      province: 'Hà Nội',
      title: 'Bạch thủ lô khung 2 ngày cực nét',
      content: 'Chào anh em Kim Tiền, hôm nay mình soi cầu thấy cặp 68-86 rất sáng cửa tại đài Hà Nội. Anh em tham khảo nhé!',
      timestamp: '10 phút trước',
      likes: 124,
      isLocked: false,
      allowComments: true,
      commentCount: 45,
      status: 'approved'
    },
    {
      id: '2',
      authorId: 'user_id_2',
      authorName: 'Minh Kiểm Soát',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      authorBadges: [ACTIVE_BADGE],
      authorRole: 'mod',
      region: 'MN',
      day: new Date().getDay(),
      province: 'TP.HCM',
      title: 'Dàn đề 10 số bất bại miền Nam',
      content: 'Lộc lá đầu tuần cho anh em đài Thành Phố. Dàn đề: 01, 10, 23, 32, 45, 54, 67, 76, 89, 98.',
      timestamp: '1 giờ trước',
      likes: 89,
      isLocked: false,
      allowComments: false,
      commentCount: 12,
      status: 'approved'
    }
  ]);

  const isAdmin = user?.role === 'admin';
  const isMod = user?.role === 'mod';
  const isAdminOrMod = isAdmin || isMod;

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    province: '',
    region: 'MB' as Region,
    day: new Date().getDay()
  });

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const regionMatch = p.region === activeRegion && p.day === activeDay;
      const statusMatch = activeFilter === 'pending' ? p.status === 'pending' : (isAdminOrMod ? true : p.status === 'approved');
      return regionMatch && statusMatch;
    });
  }, [posts, activeRegion, activeDay, activeFilter, isAdminOrMod]);

  const handleOpenCreateModal = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    if (!user.isActivated) {
      setActivationError(true);
      setTimeout(() => setActivationError(false), 5000);
      return;
    }
    setShowCreateModal(true);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const post: Post = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorBadges: user.badges || [],
      authorRole: user.role,
      region: newPost.region,
      day: newPost.day,
      province: newPost.province || 'Tất cả',
      title: newPost.title,
      content: newPost.content,
      timestamp: 'Vừa xong',
      likes: 0,
      isLocked: false,
      allowComments: true,
      commentCount: 0,
      status: isAdminOrMod ? 'approved' : 'pending'
    };

    setPosts([post, ...posts]);
    setShowCreateModal(false);
    setNewPost({ title: '', content: '', province: '', region: 'MB', day: new Date().getDay() });
    if (!isAdminOrMod) {
      alert("Bài viết đã được gửi! Vui lòng chờ Ban Quản Trị duyệt.");
    }
  };

  const handleApprove = (id: string) => {
    if (!isAdminOrMod) return;
    setPosts(posts.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  const handleDeletePost = (post: Post) => {
    const isPostOwner = user?.id === post.authorId;
    const canDelete = isAdmin || 
                    (isMod && (post.authorRole === 'user' || isPostOwner)) || 
                    isPostOwner;

    if (!canDelete) {
      alert("Bạn không có quyền xóa bài viết này.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setPosts(posts.filter(p => p.id !== post.id));
    }
  };

  const handleEditClick = (post: Post) => {
    const isPostOwner = user?.id === post.authorId;
    const canEdit = isAdmin || 
                  (isMod && (post.authorRole === 'user' || isPostOwner)) || 
                  isPostOwner;

    if (!canEdit) {
      alert("Bạn không có quyền chỉnh sửa bài viết này.");
      return;
    }
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p));
    setShowEditModal(false);
    setEditingPost(null);
  };

  const handleToggleLock = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, isLocked: !p.isLocked } : p
    ));
  };

  const handleToggleComments = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, allowComments: !p.allowComments } : p
    ));
  };

  return (
    <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden mb-12">
      <div className="bg-gradient-to-r from-[#b91c1c] to-[#7f1d1d] p-8 text-white relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
              <span className="text-yellow-400">🔥</span> THẢO LUẬN KIM TIỀN
            </h2>
            <p className="text-yellow-200/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Giao lưu bộ số - Kết nối tài lộc</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={handleOpenCreateModal}
              className="bg-yellow-500 hover:bg-yellow-400 text-[#7f1d1d] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-500/20 transition-all active:scale-95"
            >
              + ĐĂNG BÀI VIẾT
            </button>
            {activationError && (
              <p className="text-[10px] font-black text-yellow-400 uppercase bg-black/40 px-3 py-1 rounded-lg animate-bounce border border-yellow-500/30">
                ⚠️ Cần Kích Hoạt Tài Khoản để đăng bài
              </p>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-white/5 skew-x-12 transform translate-x-32"></div>
      </div>

      <div className="flex bg-gray-50 border-b border-gray-100">
        {REGIONS.map(reg => (
          <button
            key={reg.id}
            onClick={() => setActiveRegion(reg.id)}
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all ${activeRegion === reg.id ? 'bg-white text-red-600 shadow-[0_-4px_0_inset_#dc2626]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {reg.name}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex overflow-x-auto no-scrollbar gap-2">
          {WEEKDAYS.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeDay === idx ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {day}
            </button>
          ))}
        </div>
        
        {isAdminOrMod && (
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === 'pending' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-400'}`}
            >
              Chờ duyệt
            </button>
          </div>
        )}
      </div>

      <div className="p-8 space-y-8 min-h-[400px]">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => {
            const isOwner = user?.id === post.authorId;
            const canModerate = isAdmin || (isMod && post.authorRole === 'user');
            const canManage = isOwner || canModerate;
            
            return (
              <div key={post.id} className={`group bg-gray-50/50 rounded-[32px] p-6 border border-gray-100 hover:border-yellow-500/30 hover:bg-white hover:shadow-2xl transition-all duration-500 relative ${post.status === 'pending' ? 'border-dashed border-red-300 bg-red-50/20' : ''} ${post.isLocked ? 'grayscale opacity-60' : ''}`}>
                 
                 <div className="absolute top-4 right-24 flex gap-2">
                    {post.status === 'pending' && (
                       <div className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg animate-pulse">
                          ⏳ ĐANG CHỜ DUYỆT
                       </div>
                    )}
                 </div>

                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                       <div className="relative">
                          <img src={post.authorAvatar} className="w-12 h-12 rounded-2xl border-2 border-yellow-500/20 shadow-md" alt={post.authorName} />
                          {post.authorRole === 'admin' && <span className="absolute -top-2 -left-2 text-lg drop-shadow-md">👑</span>}
                          {post.authorRole === 'mod' && <span className="absolute -top-2 -left-2 text-lg drop-shadow-md">🛡️</span>}
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <div className="flex flex-col">
                                <p className={`font-black text-sm flex items-center gap-2 ${post.authorRole === 'admin' ? 'text-red-700' : post.authorRole === 'mod' ? 'text-blue-700' : 'text-gray-900'}`}>
                                  {post.authorName}
                                </p>
                             </div>
                             {post.authorRole !== 'user' && (
                               <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest ${post.authorRole === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                 {post.authorRole === 'admin' ? 'Admin' : 'Mod'}
                               </span>
                             )}
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{post.timestamp} • Đài: <span className="text-red-600">{post.province}</span></p>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                       {canManage && (
                         <div className="flex gap-1 mr-4 bg-white/80 p-1 rounded-xl shadow-sm border border-gray-100">
                            {isAdminOrMod && post.status === 'pending' && (
                               <button 
                                 onClick={() => handleApprove(post.id)}
                                 className="p-2 bg-green-500 text-white rounded-lg transition-all hover:bg-green-600"
                               >
                                 ✅
                               </button>
                            )}
                            <button 
                              onClick={() => handleEditClick(post)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-400 hover:text-blue-600"
                            >
                              ✏️
                            </button>
                            {isOwner && (
                               <>
                                <button 
                                  onClick={() => handleToggleLock(post.id)}
                                  className={`p-2 rounded-lg transition-all ${post.isLocked ? 'bg-yellow-500 text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-yellow-600'}`}
                                >
                                  {post.isLocked ? '🔓' : '🔒'}
                                </button>
                                <button 
                                  onClick={() => handleToggleComments(post.id)}
                                  className={`p-2 rounded-lg transition-all ${!post.allowComments ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-600'}`}
                                >
                                  {post.allowComments ? '💬' : '📵'}
                                </button>
                               </>
                            )}
                            <button 
                              onClick={() => handleDeletePost(post)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-all text-gray-400 hover:text-red-600"
                            >
                              🗑️
                            </button>
                         </div>
                       )}

                       <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                          <span className="text-red-500 text-xs">❤️</span>
                          <span className="text-[10px] font-black text-gray-600">{post.likes}</span>
                       </div>
                    </div>
                 </div>

                 <h3 className={`text-lg font-black mb-2 uppercase tracking-tight transition-colors ${post.isLocked ? 'text-gray-400' : 'text-gray-800 group-hover:text-red-600'}`}>
                    {post.title}
                 </h3>
                 <p className={`text-sm font-medium leading-relaxed ${post.isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                    {post.content}
                 </p>

                 <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                          disabled={!post.allowComments}
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors ${post.allowComments ? 'text-gray-400 hover:text-red-600' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                           {post.allowComments ? `Xem bình luận (${post.commentCount})` : 'Bình luận đã bị khóa'}
                        </button>
                        <button 
                          onClick={() => setSharingPost(post)}
                          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                          Chia sẻ
                        </button>
                    </div>
                 </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
             <div className="text-7xl mb-4">🧧</div>
             <p className="font-black text-gray-400 uppercase tracking-widest text-sm text-center">Chưa có thảo luận nào phù hợp.</p>
          </div>
        )}
      </div>

      {sharingPost && (
        <ShareMenu 
          url={window.location.origin + '/post/' + sharingPost.id}
          title={sharingPost.title}
          onClose={() => setSharingPost(null)}
        />
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
           <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
           <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-yellow-500/20">
              <div className="bg-[#b91c1c] p-8 text-center text-white">
                 <h2 className="text-2xl font-black uppercase tracking-tighter">TẠO BÀI VIẾT MỚI</h2>
              </div>
              <form onSubmit={handleCreatePost} className="p-10 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Chọn Miền</label>
                       <select 
                         value={newPost.region}
                         onChange={(e) => setNewPost({...newPost, region: e.target.value as Region})}
                         className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold focus:border-red-500 outline-none"
                       >
                          {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Đài (Tỉnh thành)</label>
                       <input 
                         type="text" 
                         placeholder="Ví dụ: TP.HCM"
                         value={newPost.province}
                         onChange={(e) => setNewPost({...newPost, province: e.target.value})}
                         className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold focus:border-red-500 outline-none"
                       />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tiêu đề bài viết</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Bạch thủ, Song thủ..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-500 outline-none"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nội dung chi tiết</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Chia sẻ cầu kèo..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-red-500 outline-none resize-none"
                    />
                 </div>
                 <button type="submit" className="w-full py-5 bg-[#b91c1c] text-white rounded-[24px] font-black text-xs shadow-2xl hover:bg-red-700 transition-all uppercase tracking-widest">
                   CÔNG KHAI BÀI VIẾT
                 </button>
                 <button type="button" onClick={() => setShowCreateModal(false)} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors">
                   Hủy bỏ
                 </button>
              </form>
           </div>
        </div>
      )}

      {showEditModal && editingPost && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
           <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
           <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-blue-500/20">
              <div className="bg-blue-900 p-8 text-center text-white">
                 <h2 className="text-2xl font-black uppercase tracking-tighter">SỬA BÀI VIẾT</h2>
              </div>
              <form onSubmit={handleUpdatePost} className="p-10 space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tiêu đề</label>
                    <input 
                      type="text" 
                      required
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-blue-500 outline-none"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nội dung</label>
                    <textarea 
                      required
                      rows={5}
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-blue-500 outline-none resize-none"
                    />
                 </div>
                 <button type="submit" className="w-full py-5 bg-blue-900 text-white rounded-[24px] font-black text-xs shadow-2xl hover:bg-blue-950 transition-all uppercase tracking-widest">
                   CẬP NHẬT
                 </button>
                 <button type="button" onClick={() => setShowEditModal(false)} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                   Hủy
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionBoard;
