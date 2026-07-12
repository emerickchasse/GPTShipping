import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateOrderRemedy } from '../order-remedy.mjs';
import { printfulExternalOrderId } from '../printful-fulfillment.mjs';

const sessionId = 'cs_test_pawswipe_remedy_drill';
const stripeSession = {
  id: sessionId,
  payment_status: 'paid',
  customer_details: { email: 'must-not-leak@example.com', phone: '+15555555555' }
};
const printfulOrder = {
  external_id: printfulExternalOrderId(sessionId),
  status: 'draft',
  recipient: { name: 'Must Not Leak', address1: '123 Private Street' }
};

test('correlates hashed order references without leaking customer data', () => {
  const result = evaluateOrderRemedy({
    stripeSession,
    printfulOrder,
    issue: { kind: 'cancellation' }
  });
  const serialized = JSON.stringify(result);

  assert.equal(result.correlationMatched, true);
  assert.equal(result.nextAction, 'attempt_supplier_cancellation');
  assert.equal(result.sessionFingerprint.length, 12);
  assert.doesNotMatch(serialized, /cs_test_|must-not-leak|555555|Private Street/i);
});

test('stops when the payment and fulfillment references do not match', () => {
  const result = evaluateOrderRemedy({
    stripeSession,
    printfulOrder: { ...printfulOrder, external_id: 'ps_unrelated' },
    issue: { kind: 'defect', deliveredAt: '2026-07-01', reportedAt: '2026-07-12', photosProvided: true }
  });

  assert.equal(result.correlationMatched, false);
  assert.equal(result.policyEligible, false);
  assert.equal(result.nextAction, 'stop_unmatched_reference');
});

test('routes in-window defects to evidence review and never auto-issues money', () => {
  const needsPhotos = evaluateOrderRemedy({
    stripeSession,
    printfulOrder,
    issue: { kind: 'defect', deliveredAt: '2026-07-01', reportedAt: '2026-07-12', photosProvided: false }
  });
  const withPhotos = evaluateOrderRemedy({
    stripeSession,
    printfulOrder,
    issue: { kind: 'defect', deliveredAt: '2026-07-01', reportedAt: '2026-07-12', photosProvided: true }
  });

  assert.equal(needsPhotos.nextAction, 'request_minimum_photos');
  assert.equal(withPhotos.nextAction, 'review_replacement_or_refund');
  assert.doesNotMatch(JSON.stringify(withPhotos), /refund_issued|replacement_created/);
});

test('uses the 30-day estimated-delivery window for transit loss', () => {
  const result = evaluateOrderRemedy({
    stripeSession,
    printfulOrder,
    issue: { kind: 'transit_loss', estimatedDeliveryAt: '2026-07-01', reportedAt: '2026-07-31' }
  });
  assert.equal(result.policyEligible, true);
  assert.equal(result.nextAction, 'verify_tracking_then_replace_or_refund');
});

test('offers delay consent or a full refund only after an unshipped promise is missed', () => {
  const result = evaluateOrderRemedy({
    stripeSession,
    printfulOrder: { ...printfulOrder, status: 'pending' },
    issue: { kind: 'delay', promisedShipAt: '2026-07-10', reviewedAt: '2026-07-12' }
  });
  assert.equal(result.policyEligible, true);
  assert.equal(result.nextAction, 'offer_delay_consent_or_full_refund');
});

