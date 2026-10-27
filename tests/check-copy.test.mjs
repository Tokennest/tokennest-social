import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkText } from '../tools/check-copy.mjs';

const rules = (text) => checkText(text).map((e) => e.rule);

test('clean copy passes', () => {
  assert.deepEqual(
    rules('Questions? contact@tokennest.com or +1-888-475-3242. TokenNest is operated by Crypto World Trade Center Inc., FINTRAC-registered MSB M23982356.'),
    [],
  );
});

test('empty text passes', () => {
  assert.deepEqual(rules(''), []);
});

test('cross-border payments need the exact waitlist label', () => {
  assert.deepEqual(rules('Cross-border payments to Mexico.'), ['status:cross-border']);
  assert.deepEqual(rules('Cross-border payments to Mexico. Coming soon · Waitlist open'), []);
  // A near miss (hyphen instead of middle dot) is not the approved label.
  assert.deepEqual(rules('Cross-border payments. Coming soon - Waitlist open'), ['status:cross-border']);
});

test('white-label and AI Agent Wallets need "Coming 2027"', () => {
  assert.deepEqual(rules('Our white-label platform'), ['status:white-label']);
  assert.deepEqual(rules('AI Agent Wallets for B2B'), ['status:ai-agent-wallets']);
  assert.deepEqual(rules('AI Agent Wallets for B2B. Coming 2027'), []);
});

test('PSP and business payouts never read as available', () => {
  assert.deepEqual(rules('Send business payouts today'), ['status:psp']);
  assert.deepEqual(rules('Business payouts in crypto (planned 2027, not yet offered)'), []);
});

test('compliance words are flagged', () => {
  assert.deepEqual(rules('Instant settlement'), ['compliance']);
  assert.deepEqual(rules('A licensed exchange'), ['compliance']);
  assert.deepEqual(rules('Guaranteed best rate'), ['compliance', 'compliance']);
});

test('unknown emails and phone numbers are flagged as PII', () => {
  assert.deepEqual(rules('Thanks jane.doe@example.com'), ['pii:email']);
  assert.deepEqual(rules('Call 604-555-0199'), ['pii:phone']);
});
