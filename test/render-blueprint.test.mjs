import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const blueprint = await readFile(new URL('../render.yaml', import.meta.url), 'utf8');
const environmentExample = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
const server = await readFile(new URL('../server.mjs', import.meta.url), 'utf8');
test('the Render Blueprint preserves on-commit deployment recovery', () => {
  assert.match(blueprint, /^\s+autoDeployTrigger: commit$/m);
  assert.doesNotMatch(blueprint, /^\s+autoDeployTrigger: checksPass$/m);
});

test('pre-launch environments default to Stripe test mode', () => {
  assert.match(blueprint, /- key: STRIPE_CHECKOUT_MODE\s+value: test/);
  assert.match(environmentExample, /^STRIPE_CHECKOUT_MODE=test$/m);
  assert.match(blueprint, /- key: LIVE_CHECKOUT_ENABLED\s+value: "false"/);
});

test('the Render Blueprint records only the evidenced private-support approval', () => {
  for (const key of [
    'PAWSWIPE_SAMPLE_APPROVED',
    'PAWSWIPE_SUPPLIER_BILLING_APPROVED',
    'PAWSWIPE_CUSTOMER_POLICIES_APPROVED'
  ]) {
    assert.match(blueprint, new RegExp(`- key: ${key}\\s+value: "false"`));
  }
  assert.match(blueprint, /- key: PAWSWIPE_PRIVATE_SUPPORT_APPROVED\s+value: "true"/);
});

test('the public environment template defaults every human approval closed', () => {
  for (const key of [
    'PAWSWIPE_SAMPLE_APPROVED',
    'PAWSWIPE_SUPPLIER_BILLING_APPROVED',
    'PAWSWIPE_CUSTOMER_POLICIES_APPROVED',
    'PAWSWIPE_PRIVATE_SUPPORT_APPROVED'
  ]) {
    assert.match(environmentExample, new RegExp(`^${key}=false$`, 'm'));
  }
});

test('the verified US delivery range is displayed by Stripe Checkout', () => {
  assert.match(blueprint, /- key: PAWSWIPE_DELIVERY_MIN_BUSINESS_DAYS\s+value: "9"/);
  assert.match(blueprint, /- key: PAWSWIPE_DELIVERY_MAX_BUSINESS_DAYS\s+value: "11"/);
  assert.match(environmentExample, /^PAWSWIPE_DELIVERY_MIN_BUSINESS_DAYS=$/m);
  assert.match(environmentExample, /^PAWSWIPE_DELIVERY_MAX_BUSINESS_DAYS=$/m);
  assert.match(server, /shipping_options\[0\]\[shipping_rate_data\]\[delivery_estimate\]\[minimum\]\[unit\].*business_day/);
  assert.match(server, /shipping_options\[0\]\[shipping_rate_data\]\[delivery_estimate\]\[maximum\]\[unit\].*business_day/);
  assert.match(server, /Delivery maximum must be at least the delivery minimum/);
});
