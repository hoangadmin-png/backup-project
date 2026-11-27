import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import type { DayInfo } from '@/lib/almanac';
import { WeatherWidget } from '@/components/WeatherWidget';

interface Props {
  info: DayInfo;
  selected: Date;
  now: Date;
  noteCount: number;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onNotes: () => void;
  onShare: () => void;
  onDetails: () => void;
}

function weekdayLabel(date: Date): string {
  return date.toLocaleDateString('vi-VN', { weekday: 'long' });
}

export function DayView({ info, selected, onPrevious, onNext, onDetails }: Props) {
  const touchStart = useRef<number | null>(null);
  const isToday = selected.toDateString() === new Date().toDateString();
  const lunarMonthLabel = `Tháng ${info.lunar.month} (${info.lunar.isLeapMonth ? 'Nhuận' : 'Đủ'})`;

  return (
    <div className="day-screen" onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = event.changedTouches[0]?.clientX - touchStart.current; if (Math.abs(distance) > 55) { if (distance < 0) onNext(); else onPrevious(); } touchStart.current = null; }}>
      <section className="day-stage" aria-label="Lịch ngày">
        <div className="month-line">
          <button className="month-arrow" onClick={onPrevious} aria-label="Ngày trước"><ArrowLeft size={18} /></button>
          <strong>Tháng {String(info.solar.month).padStart(2, '0')} / {info.solar.year}</strong>
          <button className="month-arrow" onClick={onNext} aria-label="Ngày sau"><ArrowRight size={18} /></button>
        </div>

        <div className="solar-hero">
          <div className="solar-stack">
            <div className="solar-number-hero">{info.solar.day}</div>
            <div className="weekday-ribbon"><span>{weekdayLabel(selected)}</span>{isToday && <small>Hôm nay</small>}</div>
          </div>
          <WeatherWidget />
        </div>

        <p className="calendar-quote">“{info.quote}”</p>

        <section className="lunar-card" aria-label="Thông tin Âm lịch">
          <span className="lunar-badge">ÂM LỊCH</span>
          <div className="cloud-ornament cloud-left" aria-hidden="true">☁</div>
          <div className="cloud-ornament cloud-right" aria-hidden="true">☁</div>
          <div className="lunar-day-number">{info.lunar.day}</div>
          <div className="lunar-meta"><strong>{lunarMonthLabel}</strong><span>Năm {info.canChiYear}</span></div>
          <div className="lunar-can-chi"><span>Ngày {info.canChiDay}</span><i /><span>{info.canChiMonth}</span></div>
          <div className="day-actions">
            <div className={`day-status ${info.isHoangDao ? 'good' : 'bad'}`}>{info.isHoangDao && <Star size={18} fill="currentColor" />}{info.isHoangDao ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo'}</div>
            <button className="detail-inline" onClick={onDetails}>Xem chi tiết <ArrowRight size={17} /></button>
          </div>
        </section>
      </section>
    </div>
  );
}
