import test from 'node:test';
import assert from 'node:assert/strict';
import { netRevenueCents } from '../revenue-accounting.mjs';

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
