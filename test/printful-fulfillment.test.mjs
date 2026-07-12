import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPrintfulOrder,
  printfulOrderPath,
  shouldAutoConfirmPrintful
} from '../printful-fulfillment.mjs';

const paidOrder = (size = 'M') => ({
  orderId: 'cs_live_a_very_long_stripe_checkout_session_identifier_123456789',
  sku: `pet-parade-${size.toLowerCase()}`,
  size,
  quantity: 2,
  currency: 'usd',
  amountTotal: 4998,
  retailUnitAmount: 2499,
  customer: {
    name: 'Jamie Example',
    email: 'jamie@example.test',
    phone: '+15555550100'
  },
  shipping: {
    address: {
      line1: '10 Main Street',
      line2: 'Unit 2',
      city: 'Buffalo',
      state: 'NY',
      postal_code: '14201',
      country: 'US'
    }
  }
});

const variants = {
  S: '6a53ef4031cc29',
  M: '6a53ef4031cc68',
  L: '6a53ef4031cc81'
};

test('maps a paid order to an idempotent Printful draft using the external variant', () => {
  const payload = buildPrintfulOrder(paidOrder('M'), variants);

  assert.match(payload.external_id, /^ps_[a-f0-9]{24}$/);
  assert.equal(payload.external_id.length, 27);
  assert.deepEqual(payload.items, [{
    external_variant_id: variants.M,
    quantity: 2,
    retail_price: '24.99'
  }]);
  assert.deepEqual(payload.recipient, {
    name: 'Jamie Example',
    email: 'jamie@example.test',
    phone: '+15555550100',
    address1: '10 Main Street',
    address2: 'Unit 2',
    city: 'Buffalo',
    state_code: 'NY',
    country_code: 'US',
    zip: '14201'
  });
  assert.equal(payload.shipping, 'STANDARD');
});

test('rejects missing size, unknown variants, and incomplete shipping addresses', () => {
  assert.throws(() => buildPrintfulOrder({ ...paidOrder(), size: '' }, variants), /size/i);
  assert.throws(() => buildPrintfulOrder(paidOrder('XL'), variants), /variant/i);
  assert.throws(() => buildPrintfulOrder({ ...paidOrder(), shipping: null }, variants), /shipping/i);
});

test('keeps Printful orders as drafts unless auto-confirm is explicitly true', () => {
  assert.equal(printfulOrderPath(false), '/orders?confirm=false&update_existing=true');
  assert.equal(printfulOrderPath('false'), '/orders?confirm=false&update_existing=true');
  assert.equal(printfulOrderPath(true), '/orders?confirm=true&update_existing=true');
});

test('supplier billing approval is required before Printful can charge', () => {
  assert.equal(shouldAutoConfirmPrintful(true, false), false);
  assert.equal(shouldAutoConfirmPrintful(true, undefined), false);
  assert.equal(shouldAutoConfirmPrintful(false, true), false);
  assert.equal(shouldAutoConfirmPrintful(true, true), true);
});

test('uses the product line amount instead of tax or shipping in the order total', () => {
  const payload = buildPrintfulOrder({
    ...paidOrder('S'),
    amountTotal: 6123,
    retailUnitAmount: 2499
  }, variants);

  assert.equal(payload.items[0].retail_price, '24.99');
});
