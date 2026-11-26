import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Clock3, FilePenLine, Map, Share2, Star } from 'lucide-react';
import type { DayInfo } from '@/lib/almanac';
import { WeatherWidget } from '@/components/WeatherWidget';
import { VietnameseArtwork } from '@/components/VietnameseArtwork';

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

const ART_BY_MONTH = [
  { title: 'Xuân về trên miền ký ức', tone: 'art-spring' },
  { title: 'Sớm mai trong vườn nắng', tone: 'art-leaf' },
  { title: 'Mùa xanh dịu dàng', tone: 'art-water' },
  { title: 'Đường về qua triền núi', tone: 'art-mountain' },
  { title: 'Nắng vàng bên hiên nhà', tone: 'art-sun' },
  { title: 'Gió đồng qua mùa hạ', tone: 'art-leaf' },
  { title: 'Mây trắng ngang trời', tone: 'art-water' },
  { title: 'Thu sang chạm ngõ', tone: 'art-autumn' },
  { title: 'Trăng rằm trên mái cổ', tone: 'art-moon' },
  { title: 'Hương cốm đầu mùa', tone: 'art-autumn' },
  { title: 'Sắc vàng của tháng nhớ', tone: 'art-gold' },
  { title: 'Đông về, lòng vẫn ấm', tone: 'art-winter' },
];

function formatClock(date: Date): string {
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map((value) => String(value).padStart(2, '0')).join(':');
}

function dateLabel(date: Date): string {
  return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function DayView({ info, selected, now, noteCount, onToday, onPrevious, onNext, onNotes, onShare, onDetails }: Props) {
  const touchStart = useRef<number | null>(null);
  const art = ART_BY_MONTH[info.solar.month - 1] ?? ART_BY_MONTH[0];
  const isToday = selected.toDateString() === new Date().toDateString();

  return (
    <div className="day-screen" onTouchStart={(event) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = event.changedTouches[0]?.clientX - touchStart.current; if (Math.abs(distance) > 55) { if (distance < 0) onNext(); else onPrevious(); } touchStart.current = null; }}>
      <section className="block-calendar" aria-label="Tờ lịch ngày">
        <div className="calendar-crest">
          <div className="crest-controls">
            <button className="day-jump" onClick={onToday} aria-label="Về hôm nay"><span>{new Date().getDate()}</span><small>HÔM NAY</small></button>
            <p className="crest-title">TỜ LỊCH NGÀY</p>
            <div className="crest-actions"><button className="crest-button" onClick={onNotes} aria-label="Ghi chú"><FilePenLine size={19} /><span>{noteCount > 0 ? noteCount : 'Ghi chú'}</span></button><button className="crest-button" onClick={onShare} aria-label="Chia sẻ"><Share2 size={19} /><span>Chia sẻ</span></button></div>
          </div>
        </div>

        <div className="calendar-paper">
          <div className="date-navigation">
            <button className="paper-nav" onClick={onPrevious} aria-label="Ngày trước"><ArrowLeft size={24} strokeWidth={2.6} /></button>
            <div>
              <p className="date-caption">{dateLabel(selected)}{isToday ? ' · Hôm nay' : ''}</p>
              <p className="solar-month">{String(info.solar.month).padStart(2, '0')} / {info.solar.year}</p>
            </div>
            <button className="paper-nav" onClick={onNext} aria-label="Ngày sau"><ArrowRight size={24} strokeWidth={2.6} /></button>
          </div>
          <div className="date-hero"><div className="large-day">{info.solar.day}</div><WeatherWidget /></div>
          <div className={`season-art ${art.tone}`}><VietnameseArtwork month={info.solar.month} /><span>{art.title}</span></div>
          <p className="calendar-quote">“{info.quote}”</p>
          <div className="swipe-hint"><ArrowLeft size={13} /> Vuốt để đổi ngày <ArrowRight size={13} /></div>
        </div>

        <div className="calendar-footer">
          <div className="footer-waves" />
          <button className="detail-inline" onClick={onDetails}><Map size={17} /> Xem chi tiết ngày <ArrowRight size={17} /></button>
          <div className="footer-grid">
            <div className="footer-column footer-day"><p className="footer-label">Ngày</p><strong>{info.canChiDay}</strong><span className={info.isHoangDao ? 'good-status' : 'bad-status'}>{info.isHoangDao ? <Star size={14} fill="currentColor" /> : <span className="status-dot" />}{info.isHoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'}</span><time><Clock3 size={13} /> {formatClock(now)}</time></div>
            <div className="lunar-medallion"><span className="medallion-ring"><strong>{info.lunar.day}</strong><i>{info.lunar.month}</i></span><small>ÂM LỊCH</small></div>
            <div className="footer-column footer-year"><p className="footer-label">Tháng</p><strong>{info.canChiMonth}</strong><p className="footer-label year-label">Năm</p><strong>{info.canChiYear}</strong></div>
          </div>
          <div className="good-hours"><Star size={15} fill="currentColor" /><span>Giờ Hoàng Đạo:</span><b>{info.hoangDaoHours.map((item) => item.chi).join(' · ')}</b><Star size={15} fill="currentColor" /></div>
        </div>
      </section>
    </div>
  );
}
