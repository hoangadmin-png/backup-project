export interface LunarNote {
  id: string;
  dateKey: string;
  title: string;
  body: string;
  createdAt: string;
}

const STORAGE_KEY = 'lich-van-nien-notes';

export function readNotes(): LunarNote[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is LunarNote => {
      if (!item || typeof item !== 'object') return false;
      const note = item as Record<string, unknown>;
      return typeof note.id === 'string' && typeof note.dateKey === 'string' && typeof note.title === 'string' && typeof note.body === 'string';
    });
  } catch {
    return [];
  }
}

export function writeNotes(notes: LunarNote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
