import { solar2lunar } from './lunar';

export interface HolidayInfo {
  name: string;
  tier: 'tet' | 'major';
}

export function getHoliday(date: Date): HolidayInfo | null {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const lunar = solar2lunar(day, month, year);

  if (lunar.month === 1) {
    if (lunar.day === 1) return { name: 'Tết Nguyên Đán', tier: 'tet' };
    if (lunar.day === 2) return { name: 'Mùng 2 Tết', tier: 'tet' };
    if (lunar.day === 3) return { name: 'Mùng 3 Tết', tier: 'tet' };
    if (lunar.day === 15) return { name: 'Tết Nguyên Tiêu', tier: 'major' };
  }
  if (lunar.month === 3 && lunar.day === 10) return { name: 'Giỗ Tổ Hùng Vương', tier: 'major' };
  if (lunar.month === 4 && lunar.day === 15) return { name: 'Lễ Phật Đản', tier: 'major' };
  if (lunar.month === 5 && lunar.day === 5) return { name: 'Tết Đoan Ngọ', tier: 'major' };
  if (lunar.month === 7 && lunar.day === 15) return { name: 'Lễ Vu Lan', tier: 'major' };
  if (lunar.month === 8 && lunar.day === 15) return { name: 'Tết Trung Thu', tier: 'major' };
  if (lunar.month === 12 && lunar.day === 23) return { name: 'Tết Ông Công Ông Táo', tier: 'major' };
  if (lunar.month === 12) {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const nextLunar = solar2lunar(next.getDate(), next.getMonth() + 1, next.getFullYear());
    if (nextLunar.day === 1 && nextLunar.month === 1) return { name: 'Giao Thừa – Tất Niên', tier: 'tet' };
  }
  return null;
}
