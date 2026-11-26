const TIME_ZONE = 7;
const PI = Math.PI;

function jdFromDate(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd >= 2299161) return jd;
  const b = Math.floor(year / 100);
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor((3 * (b + 3)) / 4) + 32044;
}

function jdToDate(jd: number): [number, number, number] {
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return [e - Math.floor((153 * m + 2) / 5) + 1, m + 3 - 12 * Math.floor(m / 10), b * 100 + d - 4800 + Math.floor(m / 10)];
}

function newMoon(k: number): number {
  const t = k / 1236.85;
  const t2 = t * t;
  const dr = PI / 180;
  const jdn = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t * t2;
  const m = 2.5534 + 29.10535669 * k - 0.0000218 * t2 - 0.00000011 * t * t2;
  const mPrime = 201.5693 + 385.4260775 * k + 0.0107438 * t2 + 0.00001239 * t * t2;
  const f = 160.7108 + 390.67050284 * k - 0.0016118 * t2 - 0.00000227 * t * t2;
  const c1 = (0.1734 - 0.000393 * t) * Math.sin(dr * m) + 0.0021 * Math.sin(dr * 2 * m) - 0.4068 * Math.sin(dr * mPrime) + 0.0161 * Math.sin(dr * 2 * mPrime) - 0.0004 * Math.sin(dr * 3 * mPrime) + 0.0104 * Math.sin(dr * 2 * f) - 0.0051 * Math.sin(dr * (m + mPrime)) - 0.0074 * Math.sin(dr * (m - mPrime)) + 0.0004 * Math.sin(dr * (2 * f + m)) - 0.0004 * Math.sin(dr * (2 * f - m)) - 0.0006 * Math.sin(dr * (2 * f + mPrime)) + 0.001 * Math.sin(dr * (2 * f - mPrime)) + 0.0005 * Math.sin(dr * (2 * mPrime + m));
  let value = jdn + c1;
  if (t < -11) {
    value += 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t * t2 - 0.000000081 * t * t2 * t;
  } else {
    value += -0.000278 + 0.000265 * t + 0.000262 * t2;
  }
  return value;
}

function sunLongitude(jdn: number): number {
  const t = (jdn - 2451545.0) / 36525;
  const dr = PI / 180;
  const m = 357.5291 + 35999.0503 * t - 0.0001559 * t * t - 0.00000048 * t * t * t;
  const l0 = 280.4665 + 36000.7698 * t + 0.0003032 * t * t;
  const dl = (1.9146 - 0.004817 * t - 0.000014 * t * t) * Math.sin(dr * m) + (0.019993 - 0.000101 * t) * Math.sin(dr * 2 * m) + 0.00029 * Math.sin(dr * 3 * m);
  let l = ((l0 + dl) * dr) % (2 * PI);
  if (l < 0) l += 2 * PI;
  return Math.floor((l / PI) * 6);
}

function newMoonDay(k: number): number {
  return Math.floor(newMoon(k) + 0.5 + TIME_ZONE / 24);
}

function sunLongitudeAt(day: number): number {
  return sunLongitude(day + 0.5 - TIME_ZONE / 24);
}

function lunarMonth11(year: number): number {
  const off = jdFromDate(31, 12, year) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let value = newMoonDay(k);
  if (sunLongitudeAt(value) >= 9) value = newMoonDay(k - 1);
  return value;
}

function leapMonthOffset(a11: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = sunLongitudeAt(newMoonDay(k + i));
  do {
    last = arc;
    i += 1;
    arc = sunLongitudeAt(newMoonDay(k + i));
  } while (arc !== last && i < 14);
  return i - 1;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

export function solar2lunar(day: number, month: number, year: number): LunarDate {
  const dayNumber = jdFromDate(day, month, year);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = newMoonDay(k + 1);
  if (monthStart > dayNumber) monthStart = newMoonDay(k);
  let a11 = lunarMonth11(year);
  let b11 = a11;
  let lunarYear = year;
  if (a11 >= monthStart) {
    a11 = lunarMonth11(year - 1);
  } else {
    lunarYear = year + 1;
    b11 = lunarMonth11(year + 1);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarMonth = diff + 11;
  let isLeapMonth = false;
  if (b11 - a11 > 365) {
    const leapOffset = leapMonthOffset(a11);
    if (diff >= leapOffset) {
      lunarMonth = diff + 10;
      if (diff === leapOffset) isLeapMonth = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth };
}

export function lunar2solar(lunarDay: number, lunarMonth: number, lunarYear: number, isLeapMonth = false): [number, number, number] {
  const a11 = lunarMonth < 11 ? lunarMonth11(lunarYear - 1) : lunarMonth11(lunarYear);
  const b11 = lunarMonth < 11 ? lunarMonth11(lunarYear) : lunarMonth11(lunarYear + 1);
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let offset = lunarMonth - 11;
  if (offset < 0) offset += 12;
  if (b11 - a11 > 365) {
    const leapOffset = leapMonthOffset(a11);
    const leapMonth = leapOffset - 1;
    if (isLeapMonth && offset !== leapMonth) return [0, 0, 0];
    if (isLeapMonth || offset >= leapMonth) offset += 1;
  }
  return jdToDate(newMoonDay(k + offset) + lunarDay - 1);
}

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export function canChiOfDay(day: number, month: number, year: number): string {
  const jd = jdFromDate(day, month, year);
  return `${CAN[(jd + 9) % 10]} ${CHI[(jd + 1) % 12]}`;
}

export function chiOfDay(day: number, month: number, year: number): string {
  const jd = jdFromDate(day, month, year);
  return CHI[(jd + 1) % 12];
}

export function canChiOfMonth(lunarMonth: number, lunarYear: number): string {
  const yearCan = (lunarYear + 6) % 10;
  const monthCan = (yearCan * 2 + 2 + lunarMonth - 1) % 10;
  return `${CAN[monthCan]} ${CHI[(lunarMonth + 1) % 12]}`;
}

export function canChiOfYear(lunarYear: number): string {
  return `${CAN[(lunarYear + 6) % 10]} ${CHI[(lunarYear + 8) % 12]}`;
}
