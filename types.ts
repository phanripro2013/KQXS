
export type Region = 'MB' | 'MT' | 'MN';
export type UserRole = 'admin' | 'mod' | 'user';

export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string; // Tailwind class color
  description: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  provider: 'google' | 'facebook' | 'telegram' | 'line';
  email?: string;
  isActivated: boolean;
  role: UserRole; // 'admin', 'mod', or 'user'
  badges: Badge[]; // Danh sách huy hiệu thành viên sở hữu
  reputation: number; // Điểm uy tín/tích lũy
}

export interface LotteryResult {
  id: string;
  date: string;
  region: Region;
  province?: string;
  prizes: {
    special: string[];
    first: string[];
    second: string[];
    third: string[];
    fourth: string[];
    fifth: string[];
    sixth: string[];
    seventh: string[];
    eighth?: string[];
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
