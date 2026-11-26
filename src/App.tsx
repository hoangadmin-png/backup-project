import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CalendarRange, BookOpen, CalendarClock, CircleHelp, X } from 'lucide-react';
import { DayView } from '@/components/DayView';
import { MonthView, type MonthCell } from '@/components/MonthView';
import { DateSwitcher } from '@/components/DateSwitcher';
import { NotesPanel } from '@/components/NotesPanel';
import { PrayerView } from '@/components/PrayerView';
import { getDayInfo } from '@/lib/almanac';
import { getHoliday } from '@/lib/holidays';
import { dateKey, readNotes, writeNotes, type LunarNote } from '@/lib/notes';

type Tab = 'day' | 'month' | 'switch' | 'prayer';
const today = new Date();

function buildMonthCells(year: number, month: number, todayDate: Date): MonthCell[] {
  const firstDay = new Date(year, month - 1, 1);
  const leading = (firstDay.getDay() + 6) % 7;
  const totalDays = new Date(year, month, 0).getDate();
  const cells: MonthCell[] = [];
  for (let index = leading; index > 0; index -= 1) {
    const date = new Date(year, month - 1, 1 - index);
    cells.push({ date, info: getDayInfo(date), holiday: getHoliday(date), isCurrentMonth: false, isToday: false });
  }
  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month - 1, day);
    cells.push({ date, info: getDayInfo(date), holiday: getHoliday(date), isCurrentMonth: true, isToday: date.toDateString() === todayDate.toDateString() });
  }
  let next = 1;
  while (cells.length % 7 !== 0) {
    const date = new Date(year, month, next);
    cells.push({ date, info: getDayInfo(date), holiday: getHoliday(date), isCurrentMonth: false, isToday: false });
    next += 1;
  }
  return cells;
}

function displayDate(date: Date): string {
  return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function App() {
  const [tab, setTab] = useState<Tab>('day');
  const [selected, setSelected] = useState(today);
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [notes, setNotes] = useState<LunarNote[]>(() => readNotes());
  const [showNotes, setShowNotes] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [now, setNow] = useState(new Date());
  const [prayerId, setPrayerId] = useState<string | null>(null);

  useEffect(() => writeNotes(notes), [notes]);
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);

  const info = useMemo(() => getDayInfo(selected), [selected]);
  const cells = useMemo(() => buildMonthCells(viewMonth.getFullYear(), viewMonth.getMonth() + 1, today), [viewMonth]);
  const selectedNotes = notes.filter((note) => note.dateKey === dateKey(selected));

  const selectDate = (date: Date, openDay = true) => {
    setSelected(date);
    setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    if (openDay) setTab('day');
    setShowDetails(false);
  };
  const goToday = () => selectDate(new Date());
  const moveDay = (amount: number) => { const next = new Date(selected); next.setDate(next.getDate() + amount); selectDate(next); };
  const moveMonth = (amount: number) => setViewMonth((value) => new Date(value.getFullYear(), value.getMonth() + amount, 1));
  const addNote = (title: string, body: string) => setNotes((current) => [...current, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, dateKey: dateKey(selected), title, body, createdAt: new Date().toISOString() }]);
  const deleteNote = (id: string) => setNotes((current) => current.filter((note) => note.id !== id));
  const shareDay = async () => {
    const text = `Ngày ${info.canChiDay}, ${displayDate(selected)} · Âm lịch ${info.lunar.day}/${info.lunar.month}/${info.lunar.year} · ${info.isHoangDao ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo'}`;
    if (navigator.share) { await navigator.share({ title: 'Lịch Vạn Niên Việt Nam', text }); return; }
    await navigator.clipboard?.writeText(text);
    window.alert('Đã sao chép thông tin ngày vào bộ nhớ tạm.');
  };

  const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
    { id: 'day', label: 'Lịch Ngày', icon: CalendarDays },
    { id: 'month', label: 'Lịch Tháng', icon: CalendarRange },
    { id: 'switch', label: 'Đổi Ngày', icon: CalendarClock },
    { id: 'prayer', label: 'Văn Khấn', icon: BookOpen },
  ];

  return (
    <div className="app-shell">
      <header className="app-header"><div className="brand-mark"><span className="brand-dot" /><div><p>NIÊN LỊCH</p><h1>Việt Nam</h1></div></div><div className="header-note"><CircleHelp size={14} /> UTC+7 · Phong tục Việt</div></header>
      <main className={`app-main ${tab === 'day' ? 'day-main' : ''}`}>
        {tab === 'day' && <DayView info={info} selected={selected} now={now} noteCount={selectedNotes.length} onToday={goToday} onPrevious={() => moveDay(-1)} onNext={() => moveDay(1)} onNotes={() => setShowNotes(true)} onShare={() => { void shareDay(); }} onDetails={() => setShowDetails(true)} />}
        {tab === 'month' && <MonthView year={viewMonth.getFullYear()} month={viewMonth.getMonth() + 1} cells={cells} selected={selected} notes={notes} onSelect={selectDate} onPrev={() => moveMonth(-1)} onNext={() => moveMonth(1)} onBack={goToday} />}
        {tab === 'switch' && <DateSwitcher selected={selected} onSelect={selectDate} />}
        {tab === 'prayer' && <PrayerView selectedPrayerId={prayerId} onSelectPrayer={setPrayerId} />}
      </main>
      <nav className="bottom-nav" aria-label="Điều hướng chính"><div>{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => { setTab(id); if (id !== 'prayer') setPrayerId(null); }}><Icon size={22} strokeWidth={tab === id ? 2.3 : 1.7} /><span>{label}</span></button>)}</div></nav>
      {showNotes && <NotesPanel dateLabel={displayDate(selected)} dateKey={dateKey(selected)} notes={selectedNotes} onAdd={addNote} onDelete={deleteNote} onClose={() => setShowNotes(false)} />}
      {showDetails && <><div className="drawer-backdrop" onClick={() => setShowDetails(false)} /><section className="details-drawer" role="dialog" aria-label="Chi tiết ngày"><div className="drawer-handle" /><button className="close-details" onClick={() => setShowDetails(false)} aria-label="Đóng chi tiết"><X size={18} /></button><p className="eyebrow">Tra cứu dân gian</p><h2>Chi tiết ngày {info.canChiDay}</h2><div className="detail-grid"><div><span>Hướng xuất hành (Hỷ Thần)</span><strong>{info.hyThan}</strong></div><div><span>Hướng tài lộc (Tài Thần)</span><strong>{info.taiThan}</strong></div><div><span>Tuổi xung khắc</span><strong>{info.clashes.join(', ')}</strong></div><div><span>Trực</span><strong>{info.truc}</strong></div></div><div className="do-avoid"><div><h3>Nên làm</h3>{info.recommended.map((item) => <span key={item}>+ {item}</span>)}</div><div><h3>Kiêng kỵ</h3>{info.avoid.map((item) => <span key={item}>− {item}</span>)}</div></div></section></>}
    </div>
  );
}
