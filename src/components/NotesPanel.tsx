import { useState } from 'react';
import { BellRing, CalendarHeart, Plus, Trash2, X } from 'lucide-react';
import type { LunarNote } from '@/lib/notes';

interface Props { dateLabel: string; dateKey: string; notes: LunarNote[]; onAdd: (title: string, body: string) => void; onDelete: (id: string) => void; onClose: () => void }

export function NotesPanel({ dateLabel, dateKey, notes, onAdd, onDelete, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const save = () => {
    if (!title.trim() && !body.trim()) return;
    onAdd(title.trim() || 'Ghi chú ngày âm lịch', body.trim());
    setTitle('');
    setBody('');
  };
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="notes-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading"><div><p className="eyebrow">Lưu theo ngày</p><h2 id="notes-title">Ghi chú âm lịch</h2><p>{dateLabel} · {dateKey}</p></div><button className="icon-button" onClick={onClose} aria-label="Đóng"><X size={20} /></button></div>
        <div className="note-form"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Tiêu đề: ngày giỗ, sinh nhật..." maxLength={80} /><textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Thêm nội dung nhắc việc" rows={3} maxLength={500} /><button className="gold-button" onClick={save}><Plus size={17} /> Lưu ghi chú</button></div>
        <div className="saved-notes"><div className="section-label"><span>Đã lưu cho ngày này</span><BellRing size={15} /></div>{notes.length === 0 ? <div className="empty-note"><CalendarHeart size={23} /><p>Chưa có ghi chú. Lưu một lời nhắc để ngày này luôn được nhớ.</p></div> : notes.map((note) => <article className="saved-note" key={note.id}><div><h3>{note.title}</h3>{note.body && <p>{note.body}</p>}</div><button className="delete-button" onClick={() => onDelete(note.id)} aria-label={`Xóa ${note.title}`}><Trash2 size={16} /></button></article>)}</div>
      </section>
    </div>
  );
}
