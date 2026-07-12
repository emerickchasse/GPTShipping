import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { netRevenueCents } from '../revenue-accounting.mjs';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('the revenue verifier has an unambiguous npm command', () => {
  assert.equal(packageJson.scripts['verify:revenue'], 'node scripts/verify-revenue.mjs');
  assert.equal(packageJson.scripts['revenue:verify'], packageJson.scripts['verify:revenue']);
});

test('gross revenue includes customer shipping but excludes collected tax', () => {
  const session = {
    amount_total: 3184,
    total_details: { amount_tax: 236 }
  };

  assert.equal(netRevenueCents(session, 0), 2948);
});

test('refunds reduce tax-exclusive revenue conservatively without going negative', () => {
  const session = {
    amount_total: 3184,
    total_details: { amount_tax: 236 }
  };

  assert.equal(netRevenueCents(session, 1000), 1948);
  assert.equal(netRevenueCents(session, 5000), 0);
});

test('missing Stripe amounts cannot create revenue', () => {
  assert.equal(netRevenueCents({}, 0), 0);
  assert.equal(netRevenueCents({ amount_total: 2948 }, Number.NaN), 0);
});
