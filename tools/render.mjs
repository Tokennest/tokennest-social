// Render a post's slides to PNG (and the Reel to MP4) from posts/<id>/post.json,
// using brand kit v3 (brand-kit/v3: brand.css, vector lockup, Toki slot).
// Usage: node tools/render.mjs posts/<id> [posts/<id> ...]
// Output: posts/<id>/out/  (slide-01.png ..., still-4x5.png, reel.mp4)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { checkText } from './check-copy.mjs';

// CommonJS require so a globally installed Playwright (NODE_PATH) resolves too.
const { chromium } = createRequire(import.meta.url)('playwright');

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'brand-kit', 'v3');
const CSS = pathToFileURL(join(KIT, 'brand.css')).href;
const LOGO = readFileSync(join(KIT, 'tokennest-logo.svg'), 'utf8');
const TOKI = join(KIT, 'assets', 'toki-thumbs-up.png');

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Brand-kit markup: *sky*, ~orange~, _muted_, \n -> <br>. */
export function rich(s) {
  const cls = { '*': 'accent', '~': 'accent-o', _: 'muted' };
  const open = { '*': false, '~': false, _: false };
  let out = '';
  for (const ch of esc(s)) {
    if (ch in cls) {
      out += open[ch] ? '</span>' : `<span class="${cls[ch]}">`;
      open[ch] = !open[ch];
    } else out += ch === '\n' ? '<br>' : ch;
  }
  return out;
}

let uid = 0;
/** Inline the vector lockup. Class names are scoped per instance: the SVG's generic
 *  .cls-N rules otherwise collide when two copies share a page (kit v3 gotcha). */
export function lockup(position = 'bl', height) {
  const tag = `lk${++uid}`;
  const svg = LOGO.replace(/<\?xml[^>]*\?>/, '')
    .replace(/cls-(\d)/g, `${tag}-$1`)
    .replace('fill: #191b36;', 'fill: #FAFAFE;')
    .replace('stroke: #181a35;', 'stroke: #FAFAFE;')
    .replace('fill: #2867a3;', 'fill: #60B1F4;');
  return `<div class="lockup ${position}"${height ? ` style="height:${height}px"` : ''}>${svg}</div>`;
}

function toki(height) {
  if (!existsSync(TOKI)) return '';
  return `<div class="toki br" style="height:${height}px"><img src="${pathToFileURL(TOKI).href}"></div>`;
}

// Soft concentric swoosh bands the published posts sit on (from kit render.py).
function field() {
  const arcs = [[520, 130], [760, 150], [1020, 170], [1300, 190]]
    .map(([r, sw]) => `<circle cx="1180" cy="430" r="${r}" fill="none" stroke="rgba(96,177,244,.10)" stroke-width="${sw}"/>`)
    .join('');
  return `<div class="field" style="background:radial-gradient(1200px 900px at 78% 18%, rgba(71,119,174,.30), transparent 62%)">
    <svg viewBox="0 0 1080 1350" preserveAspectRatio="xMidYMid slice">${arcs}</svg></div>`;
}

const MOTIFS = {
  // Illustrative only: not a real address.
  'address-check': () => `
    <div class="addr"><div class="addr-label">Example address</div>
      <div class="addr-text"><b>0x7a3F</b>e91c04d2b8a6f53e017c4d9b2a<b>9C1e</b></div>
      <div class="addr-hint">Check the first and last characters</div></div>`,
  blocks: () => `<div class="blocks">${'<div class="block"><span>✓</span></div>'.repeat(3)}</div>`,
};

// Layout additions on top of brand.css, kept to what the kit doesn't cover.
const EXTRA = `
  .numeral{font-size:220px;line-height:.9;font-weight:800;color:var(--blue)}
  .addr{margin-top:12px;border:2px solid rgba(201,232,253,.35);border-radius:28px;padding:30px 36px;background:rgba(201,232,253,.06)}
  .addr-label{font-size:24px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--pale)}
  .addr-text{font-family:'DejaVu Sans Mono',monospace;font-size:31px;margin:16px 0;color:var(--pale)}
  .addr-text b{color:var(--navy);background:var(--sky);padding:0 6px;border-radius:6px}
  .addr-hint{font-size:28px;font-weight:600;color:var(--orange)}
  .blocks{display:flex;gap:36px}
  .block{width:180px;height:180px;border-radius:28px;background:var(--pale);display:flex;align-items:center;justify-content:center}
  .block span{color:var(--navy);font-size:100px;font-weight:800}
  .fine{position:absolute;left:var(--m);right:var(--m);bottom:calc(var(--m) + 130px);display:flex;flex-direction:column;gap:6px}`;

function shell(size, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${CSS}">
    <style>${EXTRA}</style></head><body><div class="card ${size}">${body}</div></body></html>`;
}

// Keep hyphenated terms ("FINTRAC-registered") on one line in the regulatory block.
const noBreakHyphens = (s) => s.replace(/(\S+-\S+)/g, '<span style="white-space:nowrap">$1</span>');

const footer = () => `${lockup('bl')}<div class="url br">tokennest.com</div>`;

/** Build one slide's HTML. `ctx` = { index, total, kicker }. */
export function slideHtml(s, ctx) {
  const count = ctx.total > 1 ? `<div class="count">${ctx.index + 1} / ${ctx.total}</div>` : '';
  const kicker = ctx.kicker ? `<div class="kicker">${esc(ctx.kicker)}</div>` : '';
  switch (s.kind) {
    case 'cover':
      return shell('feed', `${field()}${count}<div class="stack middle"><div class="rule"></div>
        <div class="h1">${rich(s.headline)}</div><div class="p">${rich(s.sub)}</div></div>${footer()}`);
    case 'step':
      return shell('feed', `${field()}${kicker}${count}<div class="stack top" style="top:220px">
        <div class="numeral">${s.n}</div><div class="h2">${rich(s.headline)}</div>
        <div class="p">${rich(s.body)}</div>${s.motif ? MOTIFS[s.motif]() : ''}</div>${footer()}`);
    case 'closing':
      return shell('feed', `${field()}${kicker}${count}<div class="stack top" style="top:300px"><div class="rule"></div>
        <div class="h2">${rich(s.headline)}</div><div class="p">${rich(s.body)}</div></div>
        <div class="fine">${s.fine.map((f) => `<div class="small">${noBreakHyphens(esc(f))}</div>`).join('')}</div>${footer()}`);
    case 'text': // Reel frame: text held between y=560 and y=1400 to clear Instagram chrome.
      return shell('story', `${field()}<div class="stack" style="top:560px;bottom:520px;justify-content:center;gap:56px">
        <div class="h2">${rich(s.text)}</div>${s.motif ? MOTIFS[s.motif]() : ''}</div>
        ${lockup('tl', 84)}<div class="url bl" style="bottom:auto;top:300px">tokennest.com</div>`);
    case 'end':
      return shell('story', `${field()}<div class="stack" style="top:560px;bottom:520px;justify-content:center;gap:40px;right:460px">
        <div class="rule"></div><div class="h1">${rich(s.text)}</div><div class="p">${rich(s.sub)}</div></div>
        ${s.mascot ? toki(760) : ''}${lockup('tl', 84)}<div class="url bl" style="bottom:auto;top:300px">tokennest.com</div>`);
    case 'still': // 4:5 Telegram/WhatsApp cut: whole canvas, no Instagram safe zones.
      return shell('tg', `${field()}<div class="stack middle"><div class="h2">${rich(s.text)}</div>
        ${s.motif ? MOTIFS[s.motif]() : ''}</div>${footer()}`);
    default:
      throw new Error(`unknown slide kind "${s.kind}"`);
  }
}

const SIZE = { cover: [1080, 1350], step: [1080, 1350], closing: [1080, 1350], still: [1080, 1350], text: [1080, 1920], end: [1080, 1920] };

async function shoot(browser, html, kind, file) {
  const [width, height] = SIZE[kind];
  const page = await browser.newPage({ viewport: { width, height } });
  // Pages load brand.css and fonts from file://, so write the HTML beside the output and navigate to it.
  const htmlFile = file.replace(/\.png$/, '.html');
  writeFileSync(htmlFile, html);
  await page.goto(pathToFileURL(htmlFile).href);
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate(() => !document.fonts.check('700 80px Poppins'));
  if (missing) throw new Error(`${file}: Poppins did not load`);
  await page.screenshot({ path: file });
  await page.close();
  rmSync(htmlFile);
}

async function renderPost(dir) {
  const post = JSON.parse(readFileSync(join(dir, 'post.json'), 'utf8'));
  const copyErrors = checkText(JSON.stringify(post));
  if (copyErrors.length) throw new Error(`${dir}: copy check failed: ${copyErrors.map((e) => e.message).join('; ')}`);

  const out = join(dir, 'out');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  const warnings = [];
  const files = [];
  const browser = await chromium.launch();
  try {
    for (const [index, s] of post.slides.entries()) {
      if (s.mascot && !existsSync(TOKI)) warnings.push(`slide ${index + 1}: Toki slot empty (add brand-kit/v3/assets/toki-thumbs-up.png)`);
      const file = join(out, `slide-${String(index + 1).padStart(2, '0')}.png`);
      await shoot(browser, slideHtml(s, { index, total: post.slides.length, kicker: post.kicker }), s.kind, file);
      files.push(file);
    }
    if (post.still) {
      const src = post.slides[post.still.fromSlide - 1];
      await shoot(browser, slideHtml({ ...src, kind: 'still' }, { index: 0, total: 1 }), 'still', join(out, 'still-4x5.png'));
    }
  } finally {
    await browser.close();
  }

  if (post.reel) renderReel(files, post.reel, join(out, 'reel.mp4'));
  return { id: post.id, version: post.version, slides: files.length, warnings };
}

/** Reel length in seconds: every card, minus the crossfade overlaps. */
export const reelSeconds = (cards, { secondsPerCard, fade }) => cards * secondsPerCard - (cards - 1) * fade;

// Quiet sustained A-major pad, synthesised by ffmpeg, so the Reel carries no third-party audio.
export function padFilter(seconds) {
  const chord = [220, 277.18, 329.63].map((f) => `sin(2*PI*${f}*t)`).join('+');
  return `aevalsrc=0.06*(${chord}):s=48000:d=${seconds.toFixed(2)},afade=t=in:d=1.5,afade=t=out:st=${(seconds - 2).toFixed(2)}:d=2`;
}

// Crossfade the card PNGs into an H.264 MP4, with the synthesised pad when reel.audio === 'pad'.
function renderReel(files, reel, outFile) {
  const { secondsPerCard, fade } = reel;
  const args = ['-y', '-loglevel', 'error'];
  for (const f of files) args.push('-loop', '1', '-t', String(secondsPerCard), '-framerate', '30', '-i', f);
  if (reel.audio === 'pad') args.push('-f', 'lavfi', '-i', padFilter(reelSeconds(files.length, reel)));
  let chain = '';
  let prev = '[0:v]';
  for (let i = 1; i < files.length; i++) {
    const label = i === files.length - 1 ? '[v]' : `[x${i}]`;
    chain += `${prev}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${((secondsPerCard - fade) * i).toFixed(2)}${label};`;
    prev = label;
  }
  args.push('-filter_complex', chain.replace(/;$/, ''), '-map', '[v]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30');
  if (reel.audio === 'pad') args.push('-map', `${files.length}:a`, '-c:a', 'aac', '-b:a', '128k', '-shortest');
  args.push(outFile);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
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
}
