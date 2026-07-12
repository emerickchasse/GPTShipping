import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeCheckoutMode, shouldFulfillStripeSession } from '../commerce-policy.mjs';
import * as commercePolicy from '../commerce-policy.mjs';

const paidSession = (livemode) => ({
  livemode,
  payment_status: 'paid',
  metadata: { store: 'pawswipe' }
});

test('normalizes only explicit Stripe checkout modes', () => {
  assert.equal(normalizeCheckoutMode('test'), 'test');
  assert.equal(normalizeCheckoutMode('live'), 'live');
  assert.throws(() => normalizeCheckoutMode(''), /STRIPE_CHECKOUT_MODE/);
  assert.throws(() => normalizeCheckoutMode('sandbox'), /STRIPE_CHECKOUT_MODE/);
});

test('test mode accepts only paid PawSwipe sandbox sessions', () => {
  assert.equal(shouldFulfillStripeSession(paidSession(false), 'test'), true);
  assert.equal(shouldFulfillStripeSession(paidSession(true), 'test'), false);
  assert.equal(shouldFulfillStripeSession({ ...paidSession(false), payment_status: 'unpaid' }, 'test'), false);
});

test('live mode accepts only paid PawSwipe live sessions', () => {
  assert.equal(shouldFulfillStripeSession(paidSession(true), 'live'), true);
  assert.equal(shouldFulfillStripeSession(paidSession(false), 'live'), false);
  assert.equal(shouldFulfillStripeSession({ ...paidSession(true), metadata: { store: 'other' } }, 'live'), false);
});

test('normalizes attribution to a small privacy-safe allowlist', () => {
  assert.equal(typeof commercePolicy.normalizeAttributionSource, 'function');
  assert.equal(commercePolicy.normalizeAttributionSource('google'), 'google');
  assert.equal(commercePolicy.normalizeAttributionSource(' SIZE_GUIDE '), 'size_guide');
  assert.equal(commercePolicy.normalizeAttributionSource('tie_guide'), 'tie_guide');
  assert.equal(commercePolicy.normalizeAttributionSource('https://tracker.example/user/42'), 'direct');
  assert.equal(commercePolicy.normalizeAttributionSource('unknown-campaign'), 'direct');
  assert.equal(commercePolicy.normalizeAttributionSource(null), 'direct');
});
