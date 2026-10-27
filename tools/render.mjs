// Render a post's slides to PNG (and the Reel to MP4) from posts/<id>/post.json.
// Usage: node tools/render.mjs posts/<id> [posts/<id> ...]
// Output: posts/<id>/out/  (slide-01.png ..., still-4x5.png, reel.mp4)
import { readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { checkText } from './check-copy.mjs';

// CommonJS require so a globally installed Playwright (NODE_PATH) resolves too.
const { chromium } = createRequire(import.meta.url)('playwright');

// Brand palette. Placeholder until brand kit v3 values are restored to this repo.
const C = { navy: '#0B1F3A', navy2: '#12305A', white: '#FFFFFF', sky: '#4FB3FF', pale: '#BFE0FF' };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// Wrap the first case-insensitive occurrence of `word` in an accent span.
function accent(text, word) {
  const safe = esc(text);
  if (!word) return safe;
  const i = safe.toLowerCase().indexOf(word.toLowerCase());
  if (i < 0) return safe;
  return `${safe.slice(0, i)}<span class="accent">${safe.slice(i, i + word.length)}</span>${safe.slice(i + word.length)}`;
}

const MOTIFS = {
  // Illustrative only: not a real address.
  'address-check': () => `
    <div class="addr"><div class="addr-label">Example address</div>
      <div class="addr-text"><b>0x7a3F</b>e91c04d2b8a6f53e017c4d9b2a6e8f1<b>9C1e</b></div>
      <div class="addr-hint">Check the first and last characters</div></div>`,
  blocks: () => `
    <div class="blocks">${[1, 2, 3].map(() => '<div class="block"><span>✓</span></div>').join('')}</div>`,
};

function slideBody(s, i, total) {
  const motif = s.motif ? MOTIFS[s.motif]() : '';
  switch (s.kind) {
    case 'cover':
      return `<div class="center"><div class="kicker">TokenNest</div><h1>${esc(s.headline)}</h1><p class="sub">${esc(s.sub)}</p></div>`;
    case 'step':
      return `<div class="numeral">${s.n}</div><h2>${esc(s.headline)}</h2><p class="body">${esc(s.body)}</p>${motif}
        <div class="pager">${i + 1} / ${total}</div>`;
    case 'closing':
      return `<div class="center"><h2>${esc(s.headline)}</h2><p class="body">${esc(s.body)}</p></div>
        <div class="fine">${s.fine.map((f) => `<div>${esc(f)}</div>`).join('')}</div>`;
    case 'text':
      return `<div class="center"><h2 class="reel">${accent(s.text, s.accent)}</h2>${motif}</div>`;
    case 'end':
      return `<div class="center"><h1>${esc(s.text)}</h1><p class="sub">${esc(s.sub)}</p></div>
        <div class="wordmark">TokenNest</div>`;
    default:
      throw new Error(`unknown slide kind "${s.kind}"`);
  }
}

function html(s, i, total, w, h) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box}
  body{width:${w}px;height:${h}px;background:linear-gradient(160deg,${C.navy} 0%,${C.navy2} 100%);color:${C.white};
       font-family:Inter,sans-serif;padding:96px 88px;position:relative;overflow:hidden}
  .center{position:absolute;inset:96px 88px;display:flex;flex-direction:column;justify-content:center}
  .kicker{color:${C.sky};font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:34px;margin-bottom:32px}
  h1{font-size:${h > 1500 ? 112 : 104}px;line-height:1.05;font-weight:800;letter-spacing:-.02em}
  h2{font-size:72px;line-height:1.12;font-weight:800;letter-spacing:-.01em}
  h2.reel{font-size:84px;line-height:1.15}
  .sub{color:${C.pale};font-size:46px;margin-top:36px;font-weight:500}
  .body{color:${C.pale};font-size:44px;line-height:1.4;margin-top:36px;font-weight:500}
  .numeral{font-size:260px;font-weight:800;color:${C.sky};line-height:1;margin:40px 0 24px}
  .accent{color:${C.sky}}
  .pager{position:absolute;right:88px;bottom:80px;color:${C.pale};font-size:30px;opacity:.7}
  .fine{position:absolute;left:88px;right:88px;bottom:88px;color:${C.pale};font-size:30px;line-height:1.5}
  .wordmark{position:absolute;left:88px;bottom:110px;color:${C.sky};font-weight:800;font-size:44px}
  .addr{margin-top:64px;border:3px solid ${C.pale};border-radius:24px;padding:36px 40px}
  .addr-label{color:${C.pale};font-size:28px;text-transform:uppercase;letter-spacing:.1em}
  .addr-text{font-family:'DejaVu Sans Mono',monospace;font-size:36px;margin:20px 0;word-break:break-all;color:${C.pale}}
  .addr-text b{color:${C.navy};background:${C.sky};padding:0 6px;border-radius:6px}
  .addr-hint{color:${C.sky};font-size:30px;font-weight:600}
  .blocks{display:flex;gap:40px;margin-top:80px}
  .block{width:200px;height:200px;border-radius:28px;background:${C.pale};display:flex;align-items:center;justify-content:center}
  .block span{color:${C.navy};font-size:110px;font-weight:800}
  </style></head><body>${slideBody(s, i, total)}</body></html>`;
}

async function renderPost(dir) {
  const post = JSON.parse(readFileSync(join(dir, 'post.json'), 'utf8'));
  const copyErrors = checkText(JSON.stringify(post));
  if (copyErrors.length) throw new Error(`${dir}: copy check failed: ${copyErrors.map((e) => e.message).join('; ')}`);

  const out = join(dir, 'out');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const { width: w, height: h } = post.size;
  const browser = await chromium.launch();
  const warnings = [];
  const files = [];
  try {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    for (const [i, s] of post.slides.entries()) {
      if (s.mascot) warnings.push(`slide ${i + 1}: mascot "${s.mascot}" not rendered (no Toki asset in repo)`);
      await page.setContent(html(s, i, post.slides.length, w, h), { waitUntil: 'load' });
      const file = join(out, `slide-${String(i + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: file });
      files.push(file);
    }
    if (post.still) {
      const { fromSlide, width, height } = post.still;
      const still = await browser.newPage({ viewport: { width, height } });
      await still.setContent(html(post.slides[fromSlide - 1], fromSlide - 1, post.slides.length, width, height));
      await still.screenshot({ path: join(out, 'still-4x5.png') });
    }
  } finally {
    await browser.close();
  }

  if (post.reel) renderReel(files, post.reel, join(out, 'reel.mp4'));
  return { id: post.id, version: post.version, slides: files.length, warnings };
}

// Crossfade the card PNGs into an H.264 MP4 (silent; add audio in the publishing tool).
function renderReel(files, { secondsPerCard, fade }, outFile) {
  const args = ['-y', '-loglevel', 'error'];
  for (const f of files) args.push('-loop', '1', '-t', String(secondsPerCard), '-framerate', '30', '-i', f);
  let chain = '';
  let prev = '[0:v]';
  for (let i = 1; i < files.length; i++) {
    const offset = (secondsPerCard - fade) * i;
    const label = i === files.length - 1 ? '[v]' : `[x${i}]`;
    chain += `${prev}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${offset.toFixed(2)}${label};`;
    prev = label;
  }
  args.push('-filter_complex', chain.replace(/;$/, ''), '-map', '[v]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30', outFile);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
}

const dirs = process.argv.slice(2);
if (!dirs.length) {
  console.error('usage: node tools/render.mjs posts/<id> [...]');
  process.exit(2);
}
for (const d of dirs) {
  const dir = resolve(d);
  if (!existsSync(join(dir, 'post.json'))) throw new Error(`${d}: no post.json`);
  const r = await renderPost(dir);
  console.log(`rendered ${r.id} ${r.version}: ${r.slides} slides`);
  for (const w of r.warnings) console.warn(`  warning: ${w}`);
}
