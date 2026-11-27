import { canChiOfDay, canChiOfMonth, canChiOfYear, CHI, chiOfDay, solar2lunar } from './lunar';

const HOANG_DAO_BY_MONTH: Record<number, string[]> = {
  1: ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  2: ['Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu', 'Tý'],
  3: ['Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi', 'Dần'],
  4: ['Ngọ', 'Mùi', 'Tuất', 'Hợi', 'Sửu', 'Thìn'],
  5: ['Thân', 'Dậu', 'Tý', 'Sửu', 'Mão', 'Ngọ'],
  6: ['Tuất', 'Hợi', 'Dần', 'Mão', 'Tỵ', 'Thân'],
  7: ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  8: ['Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu', 'Tý'],
  9: ['Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi', 'Dần'],
  10: ['Ngọ', 'Mùi', 'Tuất', 'Hợi', 'Sửu', 'Thìn'],
  11: ['Thân', 'Dậu', 'Tý', 'Sửu', 'Mão', 'Ngọ'],
  12: ['Tuất', 'Hợi', 'Dần', 'Mão', 'Tỵ', 'Thân'],
};

const HOANG_DAO_HOURS: Record<string, string[]> = {
  Tý: ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Thân', 'Dậu'],
  Ngọ: ['Dần', 'Mão', 'Thìn', 'Tỵ', 'Thân', 'Dậu'],
  Sửu: ['Tý', 'Dần', 'Mão', 'Ngọ', 'Thân', 'Tuất'],
  Mùi: ['Tý', 'Dần', 'Mão', 'Ngọ', 'Thân', 'Tuất'],
  Dần: ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  Thân: ['Tý', 'Sửu', 'Thìn', 'Tỵ', 'Mùi', 'Tuất'],
  Mão: ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
  Dậu: ['Tý', 'Dần', 'Mão', 'Ngọ', 'Mùi', 'Dậu'],
  Thìn: ['Sửu', 'Dần', 'Thìn', 'Ngọ', 'Thân', 'Dậu'],
  Tuất: ['Sửu', 'Dần', 'Thìn', 'Ngọ', 'Thân', 'Dậu'],
  Tỵ: ['Dần', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
  Hợi: ['Dần', 'Thìn', 'Tỵ', 'Thân', 'Dậu', 'Hợi'],
};

export const CHI_TIME: Record<string, string> = {
  Tý: '23h–01h', Sửu: '01h–03h', Dần: '03h–05h', Mão: '05h–07h',
  Thìn: '07h–09h', Tỵ: '09h–11h', Ngọ: '11h–13h', Mùi: '13h–15h',
  Thân: '15h–17h', Dậu: '17h–19h', Tuất: '19h–21h', Hợi: '21h–23h',
};

const TRUC = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'];
const DIRECTIONS = ['Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc', 'Bắc', 'Đông Bắc'];
const QUOTES = [
  'Có công mài sắt, có ngày nên kim.',
  'Đi một ngày đàng, học một sàng khôn.',
  'Gieo gió gặt bão, gieo thiện lành gặp an vui.',
  'Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao.',
  'Thuận vợ thuận chồng, tát biển Đông cũng cạn.',
  'Lửa thử vàng, gian nan thử sức.',
  'Chớ thấy sóng cả mà ngã tay chèo.',
  'Tốt gỗ hơn tốt nước sơn.',
  'Học ăn, học nói, học gói, học mở.',
  'Uống nước nhớ nguồn.',
  'Tháng mười chưa cười đã tối.',
  'Đông qua xuân tới, vạn vật hồi sinh.',
];

export interface HourInfo { chi: string; time: string }
export interface DayInfo {
  solar: { day: number; month: number; year: number };
  lunar: { day: number; month: number; year: number; isLeapMonth: boolean };
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  chiDay: string;
  isHoangDao: boolean;
  truc: string;
  hoangDaoHours: HourInfo[];
  hacDaoHours: HourInfo[];
  quote: string;
  hyThan: string;
  taiThan: string;
  clashes: string[];
  recommended: string[];
  avoid: string[];
}

export function isHoangDao(lunarMonth: number, dayChi: string): boolean {
  return HOANG_DAO_BY_MONTH[lunarMonth]?.includes(dayChi) ?? false;
}

export function getDayInfo(date: Date): DayInfo {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const lunar = solar2lunar(day, month, year);
  const chiDay = chiOfDay(day, month, year);
  const goodHours = HOANG_DAO_HOURS[chiDay] ?? [];
  const isHoangDaoDay = isHoangDao(lunar.month, chiDay);
  const directionIndex = (day + lunar.month) % DIRECTIONS.length;
  const dayChiIndex = CHI.indexOf(chiDay);
  const clashes = [CHI[(dayChiIndex + 6) % 12], CHI[(dayChiIndex + 6) % 12]];
  const recommended = isHoangDaoDay ? ['Khai trương', 'Giao dịch', 'Xuất hành', 'Cầu tài'] : ['Làm việc thường nhật', 'Sắp xếp nhà cửa'];
  const avoid = isHoangDaoDay ? ['Tranh chấp', 'Việc nóng vội'] : ['Động thổ', 'Khai trương', 'Cưới hỏi trọng đại'];
  return {
    solar: { day, month, year },
    lunar,
    canChiDay: canChiOfDay(day, month, year),
    canChiMonth: canChiOfMonth(lunar.month, lunar.year),
    canChiYear: canChiOfYear(lunar.year),
    chiDay,
    isHoangDao: isHoangDaoDay,
    truc: TRUC[(dayChiIndex + lunar.month - 1 + 12) % 12],
    hoangDaoHours: goodHours.map((chi) => ({ chi, time: CHI_TIME[chi] })),
    hacDaoHours: CHI.filter((chi) => !goodHours.includes(chi)).map((chi) => ({ chi, time: CHI_TIME[chi] })),
    quote: QUOTES[(month - 1) % QUOTES.length],
    hyThan: DIRECTIONS[directionIndex],
    taiThan: DIRECTIONS[(directionIndex + 2) % DIRECTIONS.length],
    clashes,
    recommended,
    avoid,
  };
}
