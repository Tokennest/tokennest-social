// Copy checks for TokenNest social posts: service-status wording, compliance words, PII.
// Usage: node tools/check-copy.mjs <dir-or-file>...   (exit 1 on any error)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Org-approved status labels (TokenNest Org Instructions v1.4).
export const STATUS = {
  crossBorder: 'Coming soon · Waitlist open',
  coming2027: 'Coming 2027',
};

const ALLOWED_EMAILS = new Set(['contact@tokennest.com']);
const ALLOWED_PHONES = new Set(['18884753242']);

// Each rule: pattern that triggers it, and the label that must sit in the same text.
const STATUS_RULES = [
  { id: 'cross-border', trigger: /cross[- ]border (payment|transfer|send)/i, requires: STATUS.crossBorder },
  { id: 'white-label', trigger: /white[- ]label/i, requires: STATUS.coming2027 },
  { id: 'ai-agent-wallets', trigger: /AI Agent Wallets?/i, requires: STATUS.coming2027 },
];

// PSP activity and business payouts are 2027 and must never read as available.
const PSP_TRIGGER = /\b(PSP|payment service provider|business payouts?|payouts? to (third[- ]party )?beneficiar)/i;
const PSP_OK = /(Coming 2027|planned 2027|not yet offered)/i;

const BANNED = [
  { re: /\binstant(ly)?\b/i, why: 'speed claim' },
  { re: /\bguarantee(d|s)?\b/i, why: 'guarantee claim' },
  { re: /\bbest rates?\b/i, why: 'rate claim' },
  { re: /\blicen[cs]ed\b/i, why: 'say "registered", never "licensed"' },
  { re: /\b(insured|insurance)\b/i, why: 'no insurance claims' },
  { re: /\b(we hold|we store|custody of your|held in your account)\b/i, why: 'TokenNest is non-custodial' },
  { re: /\b(invest now|buy now|to the moon|you should buy)\b/i, why: 'investment-advice tone' },
];

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_RE = /\+?\d[\d\s().-]{8,}\d/g;

/** Check one text blob. Returns a list of { rule, message } errors. */
export function checkText(text) {
  const errors = [];
  for (const r of STATUS_RULES) {
    if (r.trigger.test(text) && !text.includes(r.requires)) {
      errors.push({ rule: `status:${r.id}`, message: `mentions ${r.id} without "${r.requires}"` });
    }
  }
  if (PSP_TRIGGER.test(text) && !PSP_OK.test(text)) {
    errors.push({ rule: 'status:psp', message: 'mentions PSP/business payouts without "Coming 2027" / "not yet offered"' });
  }
  for (const b of BANNED) {
    const m = text.match(b.re);
    if (m) errors.push({ rule: 'compliance', message: `"${m[0]}": ${b.why}` });
  }
  for (const email of text.match(EMAIL_RE) ?? []) {
    if (!ALLOWED_EMAILS.has(email.toLowerCase())) {
      errors.push({ rule: 'pii:email', message: `unexpected email address ${email}` });
    }
  }
  for (const phone of text.match(PHONE_RE) ?? []) {
    const digits = phone.replace(/\D/g, '');
    // FINTRAC MSB number and similar IDs are letters+digits; only flag phone-shaped runs.
    if (digits.length >= 10 && digits.length <= 11 && !ALLOWED_PHONES.has(digits.padStart(11, '1'))) {
      errors.push({ rule: 'pii:phone', message: `unexpected phone number ${phone.trim()}` });
    }
  }
  return errors;
}

function collectFiles(path) {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap((name) => {
    const p = join(path, name);
    if (name === 'out' || name.startsWith('.')) return [];
    return statSync(p).isDirectory() ? collectFiles(p) : ['.json', '.md'].includes(extname(p)) ? [p] : [];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const targets = process.argv.slice(2);
  if (!targets.length) {
    console.error('usage: node tools/check-copy.mjs <dir-or-file>...');
    process.exit(2);
  }
  let failed = 0;
  for (const file of targets.flatMap(collectFiles)) {
    const errors = checkText(readFileSync(file, 'utf8'));
    for (const e of errors) console.error(`${file}: [${e.rule}] ${e.message}`);
    failed += errors.length;
    if (!errors.length) console.log(`ok  ${file}`);
  }
  process.exit(failed ? 1 : 0);
}
