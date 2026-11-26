interface Props { month: number }

// Bảng màu thủy mặc theo mùa: xuân (1-3), hạ (4-6), thu (7-9), đông (10-12)
interface Palette { sky: string; skyDeep: string; mist: string; hill: string; hillDeep: string; water: string; lotus: string; lotusDeep: string; moon: string; ink: string }

const palettes: Palette[] = [
  { sky: '#e9f2ec', skyDeep: '#c2ddd2', mist: '#f6f3e4', hill: '#6f9b7c', hillDeep: '#41695a', water: '#a7cdc4', lotus: '#f0c05a', lotusDeep: '#c98f2c', moon: '#fff3b8', ink: '#3d5648' },
  { sky: '#ecf3ee', skyDeep: '#c8e0d2', mist: '#f8f5e8', hill: '#75997c', hillDeep: '#476d59', water: '#a9cec2', lotus: '#f3c45e', lotusDeep: '#cd9330', moon: '#fff4bc', ink: '#415a4c' },
  { sky: '#e7f0ea', skyDeep: '#bed9ca', mist: '#f4f1e0', hill: '#6a9477', hillDeep: '#3e6455', water: '#a2c9bf', lotus: '#eec04f', lotusDeep: '#c58a28', moon: '#fff2b4', ink: '#3a5346' },
  { sky: '#f3ecd4', skyDeep: '#ddce9d', mist: '#faf4de', hill: '#7d8a5e', hillDeep: '#525c3e', water: '#b3c7a8', lotus: '#e8a93c', lotusDeep: '#bb7a20', moon: '#fff0a9', ink: '#56564033' },
  { sky: '#f6e9c6', skyDeep: '#e3c98d', mist: '#fbf3da', hill: '#82855a', hillDeep: '#585e3f', water: '#bcc9a2', lotus: '#e3a232', lotusDeep: '#b5761c', moon: '#fff0a5', ink: '#5b5b3a' },
  { sky: '#f3e7c8', skyDeep: '#dfc68e', mist: '#f9f2d8', hill: '#7c865e', hillDeep: '#535c40', water: '#b5c7a6', lotus: '#e09d31', lotusDeep: '#b2731b', moon: '#fff1a8', ink: '#575739' },
  { sky: '#eceada', skyDeep: '#cfcdab', mist: '#f7f3e2', hill: '#748065', hillDeep: '#4b5544', water: '#aebfa8', lotus: '#d99a33', lotusDeep: '#aa6d1d', moon: '#fff3bb', ink: '#4c5442' },
  { sky: '#efe5cd', skyDeep: '#d8c49b', mist: '#f9f2de', hill: '#7d7a58', hillDeep: '#54523c', water: '#bcb59a', lotus: '#d3922c', lotusDeep: '#a3661a', moon: '#fff2b6', ink: '#55523a' },
  { sky: '#f0e4c6', skyDeep: '#d6bd8c', mist: '#f9f0d6', hill: '#7f7a55', hillDeep: '#575339', water: '#b9b193', lotus: '#d0932e', lotusDeep: '#a2651c', moon: '#fff0ab', ink: '#565238' },
  { sky: '#e6e9e6', skyDeep: '#c2ccc8', mist: '#f2f1e6', hill: '#677a6e', hillDeep: '#40514a', water: '#9fb8b2', lotus: '#d1a041', lotusDeep: '#a3732a', moon: '#fff4c2', ink: '#414f48' },
  { sky: '#e3e8e7', skyDeep: '#bcc9c6', mist: '#f0f0e5', hill: '#62766c', hillDeep: '#3c4d46', water: '#98b3ad', lotus: '#cd9c3e', lotusDeep: '#9f7029', moon: '#fff5c4', ink: '#3e4c45' },
  { sky: '#e6ecea', skyDeep: '#c0cfcb', mist: '#f3f2e8', hill: '#657b71', hillDeep: '#3e524b', water: '#9db8b3', lotus: '#d2a244', lotusDeep: '#a4762c', moon: '#fff5c8', ink: '#40524b' },
];

export function VietnameseArtwork({ month }: Props) {
  const p = palettes[(month - 1) % palettes.length];
  const moonHigh = month >= 8 || month <= 2;
  return (
    <div className="vietnamese-art" aria-label="Tranh thủy mặc non nước Việt Nam theo mùa">
      <svg viewBox="0 0 520 176" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ink-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.skyDeep} /><stop offset="1" stopColor={p.sky} /></linearGradient>
          <linearGradient id="ink-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.water} /><stop offset="1" stopColor={p.sky} /></linearGradient>
          <linearGradient id="ink-lotus" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.lotus} /><stop offset="1" stopColor={p.lotusDeep} /></linearGradient>
          <linearGradient id="ink-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.mist} stopOpacity="0" /><stop offset="1" stopColor={p.mist} stopOpacity=".9" /></linearGradient>
          <filter id="ink-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
        </defs>
        <rect width="520" height="176" fill="url(#ink-sky)" />
        <circle cx={moonHigh ? 424 : 96} cy="42" r="21" fill={p.moon} opacity=".95" />
        <circle cx={moonHigh ? 424 : 96} cy="42" r="30" fill={p.moon} opacity=".22" filter="url(#ink-blur)" />
        <path d="M0 96 Q60 58 118 88 Q160 48 214 84 Q268 52 322 86 Q382 56 436 88 Q480 66 520 90 V176 H0Z" fill={p.hill} opacity=".72" filter="url(#ink-blur)" />
        <path d="M0 112 Q70 74 132 102 Q186 66 244 102 Q304 72 362 104 Q428 76 478 106 Q502 96 520 104 V176 H0Z" fill={p.hill} opacity=".9" />
        <path d="M0 128 Q84 96 158 122 Q224 92 292 122 Q364 96 432 124 Q478 108 520 124 V176 H0Z" fill={p.hillDeep} opacity=".92" />
        <rect y="118" width="520" height="58" fill="url(#ink-water)" opacity=".9" />
        <path d="M20 138 Q120 128 226 138 T506 138" fill="none" stroke="#fdf6d8" strokeWidth="1.6" opacity=".7" />
        <path d="M40 150 Q150 141 262 150 T494 150" fill="none" stroke="#fdf6d8" strokeWidth="1.2" opacity=".55" />
        <g opacity=".5" fill="none" stroke={p.mist} strokeWidth="4" strokeLinecap="round" filter="url(#ink-blur)">
          <path d="M60 78 Q92 64 124 78" /><path d="M330 70 Q362 56 394 70" />
        </g>
        <g transform="translate(88 60)">
          <path d="M0 58 Q14 28 26 0" fill="none" stroke={p.ink} strokeWidth="3" strokeLinecap="round" opacity=".8" />
          <path d="M14 30 Q-4 24 -12 10 M16 24 Q36 17 48 2 M6 46 Q-10 43 -20 32 M12 42 Q32 39 48 28" fill="none" stroke={p.ink} strokeWidth="2" strokeLinecap="round" opacity=".7" />
          <g fill="url(#ink-lotus)" stroke={p.mist} strokeWidth="1">
            <circle cx="-12" cy="10" r="4.4" /><circle cx="48" cy="2" r="4.4" /><circle cx="-20" cy="32" r="4.4" /><circle cx="48" cy="28" r="4.4" /><circle cx="26" cy="0" r="4.4" />
          </g>
        </g>
        <g transform="translate(332 122)">
          <path d="M0 26 Q18 10 36 26 Q54 6 74 28" fill="none" stroke={p.ink} strokeWidth="2.4" opacity=".75" />
          <path d="M14 22 C6 8 12 -4 24 -10 C34 2 28 16 14 22Z" fill="url(#ink-lotus)" opacity=".95" />
          <path d="M52 24 C46 8 54 -6 66 -12 C75 4 66 18 52 24Z" fill={p.lotus} opacity=".85" />
        </g>
        <g transform="translate(236 140)" fill="url(#ink-lotus)" stroke={p.lotusDeep} strokeWidth="1">
          <path d="M0 16 Q16 2 32 16 Q16 20 0 16Z" /><path d="M16 16 Q6 4 16 -2 Q26 4 16 16Z" />
        </g>
        <rect width="520" height="176" fill="url(#ink-fade)" />
      </svg>
    </div>
  );
}
