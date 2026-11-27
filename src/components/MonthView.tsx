import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Star } from 'lucide-react';
import type { DayInfo } from '@/lib/almanac';
import type { HolidayInfo } from '@/lib/holidays';
import type { LunarNote } from '@/lib/notes';

export interface MonthCell { date: Date; info: DayInfo; holiday: HolidayInfo | null; isCurrentMonth: boolean; isToday: boolean }
interface Props { year: number; month: number; cells: MonthCell[]; selected: Date; notes: LunarNote[]; onSelect: (date: Date) => void; onPrev: () => void; onNext: () => void; onBack: () => void }
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function key(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }

export function MonthView({ year, month, cells, selected, notes, onSelect, onPrev, onNext, onBack }: Props) {
  const [goodOnly, setGoodOnly] = useState(false);
  const lunarMonth = cells.find((cell) => cell.isCurrentMonth)?.info.lunar.month;
  const selectedKey = key(selected);
  const noteDates = useMemo(() => new Set(notes.map((note) => note.dateKey)), [notes]);
  return (
    <div className="month-screen">
      <section className="month-card">
        <div className="month-toolbar"><button className="round-button" onClick={onPrev} aria-label="Tháng trước"><ChevronLeft size={19} /></button><div className="month-heading"><h2>Tháng {month} · {year}</h2><span>Âm lịch tháng {lunarMonth ?? '--'}</span></div><button className="round-button" onClick={onNext} aria-label="Tháng sau"><ChevronRight size={19} /></button></div>
        <div className="month-filter"><button className={`filter-switch ${goodOnly ? 'active' : ''}`} onClick={() => setGoodOnly((value) => !value)} aria-pressed={goodOnly}><span className="switch-track"><span /></span><Filter size={14} /> Chỉ làm nổi bật ngày Hoàng Đạo</button><span className="star-legend"><Star size={17} fill="currentColor" /> {cells.filter((cell) => cell.isCurrentMonth && cell.info.isHoangDao).length} ngày tốt</span></div>
        <div className="week-row">{WEEKDAYS.map((day) => <span key={day}>{day}</span>)}</div>
        <div className="month-grid">{cells.map((cell) => {
          const isSelected = key(cell.date) === selectedKey;
          const isDimmed = goodOnly && cell.isCurrentMonth && !cell.info.isHoangDao;
          const isHoliday = cell.holiday !== null && cell.isCurrentMonth;
          return <button key={key(cell.date)} className={`month-cell ${!cell.isCurrentMonth ? 'outside' : ''} ${isDimmed ? 'dimmed' : ''} ${cell.isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${cell.info.isHoangDao && cell.isCurrentMonth ? 'lucky' : ''} ${isHoliday ? 'holiday' : ''} ${isHoliday && cell.holiday?.tier === 'tet' ? 'holiday-tet' : ''}`} onClick={() => onSelect(cell.date)} aria-label={`${cell.date.getDate()} tháng ${cell.date.getMonth() + 1}`}>
            <span className="solar-number">{cell.date.getDate()}</span><span className="lunar-number">{cell.info.lunar.day === 1 ? `1/${cell.info.lunar.month}` : cell.info.lunar.day}</span>{isHoliday && <span className="holiday-label">{cell.holiday?.name}</span>}{cell.info.isHoangDao && cell.isCurrentMonth && <Star className="calendar-star" size={22} fill="currentColor" strokeWidth={1.7} />}{noteDates.has(key(cell.date)) && <span className="note-dot" />}
          </button>;
        })}</div>
        <div className="month-legend"><span><i className="holiday-swatch" /> Ngày Lễ, Tết Âm lịch</span><span><Star size={18} fill="currentColor" /> Hoàng Đạo</span><span><i className="note-dot static" /> Có ghi chú</span></div>
      </section>
      <button className="wide-dark-button" onClick={onBack}>Về tờ lịch hôm nay</button>
    </div>
  );
}
