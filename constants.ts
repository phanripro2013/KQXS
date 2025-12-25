
import { Region } from './types';

export const REGIONS: { id: Region; name: string }[] = [
  { id: 'MB', name: 'Miền Bắc' },
  { id: 'MT', name: 'Miền Trung' },
  { id: 'MN', name: 'Miền Nam' },
];

export const PRIZE_NAMES: Record<string, string> = {
  special: 'Đặc Biệt',
  first: 'Giải Nhất',
  second: 'Giải Nhì',
  third: 'Giải Ba',
  fourth: 'Giải Tư',
  fifth: 'Giải Năm',
  sixth: 'Giải Sáu',
  seventh: 'Giải Bảy',
  eighth: 'Giải Tám',
};

// Lịch quay thưởng chi tiết
export const LOTTERY_SCHEDULE: Record<Region, Record<number, string[]>> = {
  MB: {
    0: ['Hà Nội'],
    1: ['Hà Nội'],
    2: ['Quảng Ninh'],
    3: ['Bắc Ninh'],
    4: ['Hà Nội'],
    5: ['Hải Phòng'],
    6: ['Nam Định'],
  },
  MN: {
    1: ['TP.HCM', 'Đồng Tháp', 'Cà Mau'],
    2: ['Bến Tre', 'Vũng Tàu', 'Bạc Liêu'],
    3: ['Đồng Nai', 'Cần Thơ', 'Sóc Trăng'],
    4: ['Tây Ninh', 'An Giang', 'Bình Thuận'],
    5: ['Vĩnh Long', 'Bình Dương', 'Trà Vinh'],
    6: ['TP.HCM', 'Long An', 'Bình Phước', 'Hậu Giang'],
    0: ['Tiền Giang', 'Kiên Giang', 'Đà Lạt'],
  },
  MT: {
    1: ['Thừa Thiên Huế', 'Phú Yên'],
    2: ['Đắk Lắk', 'Quảng Nam'],
    3: ['Đà Nẵng', 'Khánh Hòa'],
    4: ['Bình Định', 'Quảng Trị', 'Quảng Bình'],
    5: ['Gia Lai', 'Ninh Thuận'],
    6: ['Đà Nẵng', 'Quảng Ngãi', 'Đắk Nông'],
    0: ['Khánh Hòa', 'Kon Tum'],
  }
};

export const WEEKDAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy'
];
