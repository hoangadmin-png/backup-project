import { useMemo, useState } from 'react';
import { ArrowRightLeft, CalendarDays, ChevronLeft, ChevronRight, Filter, Search, Star } from 'lucide-react';
import { getDayInfo } from '@/lib/almanac';
import { lunar2solar, solar2lunar } from '@/lib/lunar';

interface Props { selected: Date; onSelect: (date: Date) => void }
type Mode = 'solar' | 'lunar';

function toInputValue(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function validDate(parts: number[]): Date | null { if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null; const date = new Date(parts[0], parts[1] - 1, parts[2]); return date.getFullYear() === parts[0] && date.getMonth() === parts[1] - 1 && date.getDate() === parts[2] ? date : null; }

export function DateSwitcher({ selected, onSelect }: Props) {
  const [mode, setMode] = useState<Mode>('solar');
  const [solarValue, setSolarValue] = useState(toInputValue(selected));
  const initialLunar = solar2lunar(selected.getDate(), selected.getMonth() + 1, selected.getFullYear());
  const [lunarDay, setLunarDay] = useState(initialLunar.day);
  const [lunarMonth, setLunarMonth] = useState(initialLunar.month);
  const [lunarYear, setLunarYear] = useState(initialLunar.year);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));

  const goodDays = useMemo(() => {
    const days = new Date(filterDate.getFullYear(), filterDate.getMonth() + 1, 0).getDate();
    return Array.from({ length: days }, (_, index) => new Date(filterDate.getFullYear(), filterDate.getMonth(), index + 1)).map((date) => ({ date, info: getDayInfo(date) })).filter((item) => item.info.isHoangDao);
  }, [filterDate]);

  const submit = () => {
    let date: Date | null = null;
    if (mode === 'solar') {
      date = validDate(solarValue.split('-').map(Number));
    } else {
      if (lunarYear < 1900 || lunarYear > 2100 || lunarMonth < 1 || lunarMonth > 12 || lunarDay < 1 || lunarDay > 30) {
        setError('Năm Âm lịch cần nằm trong khoảng 1900–2100.');
        return;
      }
      const [day, month, year] = lunar2solar(lunarDay, lunarMonth, lunarYear);
      date = day > 0 ? new Date(year, month - 1, day) : null;
    }
    if (!date || date.getFullYear() < 1900 || date.getFullYear() > 2100) {
      setError('Ngày bạn chọn chưa hợp lệ.');
      return;
    }
    setError('');
    setFilterDate(new Date(date.getFullYear(), date.getMonth(), 1));
    onSelect(date);
  };

  const updateSolar = (value: string) => {
    setSolarValue(value);
    const parts = value.split('-').map(Number);
    const date = validDate(parts);
    if (date) {
      const lunar = solar2lunar(date.getDate(), date.getMonth() + 1, date.getFullYear());
      setLunarDay(lunar.day); setLunarMonth(lunar.month); setLunarYear(lunar.year);
    }
  };

  return (
    <div className="switch-screen">
      <div className="section-intro"><p className="eyebrow">Tra ngày theo hai chiều</p><h1>Đổi ngày & lọc ngày tốt</h1><p>Chọn ngày Dương hoặc nhập ngày Âm trong khoảng 1900–2100 để xem ngay thông tin tương ứng.</p></div>
      <section className="converter-card">
        <div className="mode-tabs"><button className={mode === 'solar' ? 'active' : ''} onClick={() => setMode('solar')}><CalendarDays size={16} /> Dương lịch → Âm lịch</button><button className={mode === 'lunar' ? 'active' : ''} onClick={() => setMode('lunar')}><ArrowRightLeft size={16} /> Âm lịch → Dương lịch</button></div>
        {mode === 'solar' ? <div className="field-block"><label htmlFor="solar-date">Ngày Dương lịch</label><input id="solar-date" type="date" min="1900-01-01" max="2100-12-31" value={solarValue} onChange={(event) => updateSolar(event.target.value)} /><div className="conversion-preview"><span>Ngày Âm lịch tương ứng</span><b>{lunarDay}/{lunarMonth}/{lunarYear}</b></div></div> : <div className="lunar-fields"><label>Ngày Âm lịch</label><div className="field-row"><input type="number" min="1" max="30" value={lunarDay} onChange={(event) => setLunarDay(Number(event.target.value))} aria-label="Ngày âm" /><input type="number" min="1" max="12" value={lunarMonth} onChange={(event) => setLunarMonth(Number(event.target.value))} aria-label="Tháng âm" /><input type="number" min="1900" max="2100" value={lunarYear} onChange={(event) => setLunarYear(Number(event.target.value))} aria-label="Năm âm" /></div><span className="field-hint">Ngày · tháng · năm Âm lịch</span></div>}
        {error && <p className="form-error">{error}</p>}<button className="gold-button full" onClick={submit}><Search size={17} /> Xem ngày đã chọn</button>
      </section>
      <section className="good-days-card"><div className="good-days-heading"><div><p className="eyebrow">Danh sách tra cứu</p><h2>Ngày Hoàng Đạo trong tháng</h2></div><Filter size={19} /></div><div className="list-month-nav"><button className="round-button" onClick={() => setFilterDate(new Date(filterDate.getFullYear(), filterDate.getMonth() - 1, 1))}><ChevronLeft size={16} /></button><strong>Tháng {filterDate.getMonth() + 1} / {filterDate.getFullYear()}</strong><button className="round-button" onClick={() => setFilterDate(new Date(filterDate.getFullYear(), filterDate.getMonth() + 1, 1))}><ChevronRight size={16} /></button></div><div className="good-day-list">{goodDays.map(({ date, info }) => <button className="good-day-row" key={date.toISOString()} onClick={() => onSelect(date)}><span className="list-date"><b>{date.getDate()}</b><small>Tháng {date.getMonth() + 1}</small></span><span className="list-middle"><strong>{info.canChiDay}</strong><small>Âm {info.lunar.day}/{info.lunar.month} · {info.truc}</small></span><span className="list-hours"><Star size={16} fill="currentColor" /><small>{info.hoangDaoHours.slice(0, 3).map((hour) => hour.chi).join(' · ')}</small></span></button>)}</div></section>
    </div>
  );
}
