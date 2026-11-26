import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';

mkdirSync('public/icons', { recursive: true });
const svg = readFileSync('public/icons/icon.svg');

await sharp(svg, { density: 300 }).resize(512, 512).png().toFile('public/icons/pwa-512.png');
await sharp(svg, { density: 300 }).resize(192, 192).png().toFile('public/icons/pwa-192.png');

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5c0f0a"/>
      <stop offset="1" stop-color="#8f241a"/>
    </linearGradient>
    <linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7dd7a"/>
      <stop offset=".5" stop-color="#d8a62b"/>
      <stop offset="1" stop-color="#9b650f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="24" y="24" width="1152" height="582" rx="40" fill="none" stroke="url(#gold2)" stroke-width="10"/>
  <g transform="translate(300 315)">
    <rect x="-190" y="-220" width="380" height="440" rx="28" fill="#fffdf6" stroke="#b98524" stroke-width="8"/>
    <rect x="-190" y="-220" width="380" height="120" rx="28" fill="#a8271c"/>
    <rect x="-190" y="-150" width="380" height="30" fill="#a8271c"/>
    <text x="0" y="-136" text-anchor="middle" font-family="'Be Vietnam Pro','Segoe UI',sans-serif" font-weight="800" font-size="72" fill="#ffe9a0">LỊCH VIỆT</text>
    <text x="0" y="80" text-anchor="middle" font-family="'Be Vietnam Pro','Segoe UI',sans-serif" font-weight="800" font-size="200" fill="#153d82">26</text>
    <g transform="translate(0 150)">
      <path d="M0-6 C-30-6 -46-30 -38-52 C-20-38 20-38 38-52 C46-30 30-6 0-6Z" fill="#e8b93a" stroke="#8d5721" stroke-width="4"/>
      <path d="M0-8 C-14-36 -2-58 0-66 C2-58 14-36 0-8Z" fill="#f7dd7a" stroke="#8d5721" stroke-width="3"/>
    </g>
    <g transform="translate(130 160)">
      <path d="M0-30 L9-9 31-9 14 5 20 28 0 14 -20 28 -14 5 -31-9 -9-9Z" fill="#f5c542" stroke="#8d5721" stroke-width="3"/>
    </g>
    <g transform="translate(-130 160)">
      <path d="M0-30 L9-9 31-9 14 5 20 28 0 14 -20 28 -14 5 -31-9 -9-9Z" fill="#f5c542" stroke="#8d5721" stroke-width="3"/>
    </g>
  </g>
  <text x="770" y="230" text-anchor="middle" font-family="'Be Vietnam Pro','Segoe UI',sans-serif" font-weight="800" font-size="58" fill="#ffe9a0">Lịch Vạn Niên Việt Nam</text>
  <text x="770" y="310" text-anchor="middle" font-family="'Be Vietnam Pro','Segoe UI',sans-serif" font-weight="600" font-size="40" fill="#f1d479">Xem Ngày Tốt &amp; Văn Khấn</text>
  <text x="770" y="392" text-anchor="middle" font-family="'Be Vietnam Pro','Segoe UI',sans-serif" font-weight="500" font-size="30" fill="#e8c98b">Âm lịch · Hoàng Đạo · Lễ Tết · Văn khấn cổ truyền</text>
  <g transform="translate(770 480)" fill="none" stroke="url(#gold2)" stroke-width="4">
    <line x1="-260" y1="0" x2="260" y2="0"/>
  </g>
  <circle cx="770" cy="480" r="10" fill="#f5c542"/>
</svg>`;

await sharp(Buffer.from(cover)).png().toFile('public/og-image.png');
console.log('done');
