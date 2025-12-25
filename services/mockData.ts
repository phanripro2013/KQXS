
import { LotteryResult, Region } from '../types';
import { LOTTERY_SCHEDULE } from '../constants';

const generateNumber = (len: number) => {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += Math.floor(Math.random() * 10).toString();
  }
  return res;
};

export const generateMockResult = (region: Region, date: string, province: string): LotteryResult => {
  const isMB = region === 'MB';
  
  return {
    id: `${region}-${province}-${date}-${Math.random().toString(36).substr(2, 5)}`,
    date,
    region,
    province,
    prizes: {
      special: [generateNumber(isMB ? 5 : 6)],
      first: [generateNumber(5)],
      second: [generateNumber(5), generateNumber(5)],
      third: [generateNumber(5), generateNumber(5), generateNumber(5), generateNumber(5), generateNumber(5), generateNumber(5)],
      fourth: [generateNumber(isMB ? 4 : 5), generateNumber(isMB ? 4 : 5), generateNumber(isMB ? 4 : 5), generateNumber(isMB ? 4 : 5), generateNumber(isMB ? 4 : 5), generateNumber(isMB ? 4 : 5), generateNumber(isMB ? 4 : 5)],
      fifth: [generateNumber(4)],
      sixth: [generateNumber(3), generateNumber(3), generateNumber(3)],
      seventh: [generateNumber(isMB ? 2 : 3)],
      ...(isMB ? {} : { eighth: [generateNumber(2)] })
    }
  };
};

export const getHistoricalResults = (count: number = 7): LotteryResult[] => {
  const results: LotteryResult[] = [];
  const regions: Region[] = ['MB', 'MT', 'MN'];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    
    regions.forEach(r => {
      const provinces = LOTTERY_SCHEDULE[r][dayOfWeek] || [];
      provinces.forEach(p => {
        results.push(generateMockResult(r, dateStr, p));
      });
    });
  }
  return results;
};
