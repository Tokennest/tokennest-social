import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rich, lockup, slideHtml } from '../tools/render.mjs';

test('rich() maps kit markup to accent spans and escapes HTML', () => {
  assert.equal(rich('Selling crypto for *CAD*'), 'Selling crypto for <span class="accent">CAD</span>');
  assert.equal(rich('~go~ _quiet_'), '<span class="accent-o">go</span> <span class="muted">quiet</span>');
  assert.equal(rich('a<b>\nc'), 'a&lt;b&gt;<br>c');
  assert.equal(rich(''), '');
});

test('each lockup gets its own class scope so two on a page do not collide', () => {
  const a = lockup('bl');
  const b = lockup('tl', 84);
  const scope = (s) => [...new Set(s.match(/lk\d+-\d/g))].map((c) => c.split('-')[0]);
  assert.equal(new Set(scope(a)).size, 1);
  assert.notDeepEqual(scope(a), scope(b));
  assert.doesNotMatch(a, /cls-\d/);
  assert.match(a, /fill: #FAFAFE;/); // recoloured for dark ground
  assert.match(b, /height:84px/);
});

test('slideHtml() puts the regulatory line on the closing slide and rejects unknown kinds', () => {
  const html = slideHtml(
    { kind: 'closing', headline: 'H', body: 'B', fine: ['TokenNest is operated by Crypto World Trade Center Inc., FINTRAC-registered MSB M23982356.'] },
    { index: 6, total: 7 },
  );
  assert.match(html, /<span style="white-space:nowrap">FINTRAC-registered<\/span> MSB M23982356/);
  assert.match(html, /7 \/ 7/);
  assert.throws(() => slideHtml({ kind: 'nope' }, { index: 0, total: 1 }), /unknown slide kind/);
});
