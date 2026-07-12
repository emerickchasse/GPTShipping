import { createHash } from 'node:crypto';
import { printfulExternalOrderId } from './printful-fulfillment.mjs';

const issueKinds = new Set(['delay', 'transit_loss', 'defect', 'cancellation']);
const cancellableStatuses = new Set(['draft', 'pending', 'onhold']);

function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function dateValue(value, label) {
  const date = new Date(requiredText(value, label));
  if (Number.isNaN(date.valueOf())) throw new Error(`${label} must be an ISO date.`);
  return date;
}

function daysBetween(start, end) {
  return Math.floor((end.valueOf() - start.valueOf()) / 86_400_000);
}

function sessionFingerprint(sessionId) {
  return createHash('sha256').update(sessionId).digest('hex').slice(0, 12);
}

export function evaluateOrderRemedy({ stripeSession, printfulOrder, issue }) {
  const sessionId = requiredText(stripeSession?.id, 'Stripe Session ID');
  const externalId = requiredText(printfulOrder?.external_id, 'Printful external order ID');
  const kind = requiredText(issue?.kind, 'Issue kind');
  if (!issueKinds.has(kind)) throw new Error('Issue kind is not supported.');

  const correlationMatched = externalId === printfulExternalOrderId(sessionId);
  const paid = stripeSession?.payment_status === 'paid';
  const base = {
    sessionFingerprint: sessionFingerprint(sessionId),
    printfulExternalOrderId: externalId,
    issueKind: kind,
    correlationMatched,
    paid,
    policyEligible: false,
    nextAction: correlationMatched ? 'manual_review' : 'stop_unmatched_reference'
  };
  if (!correlationMatched || !paid) return base;

  if (kind === 'defect') {
    const reportedAt = dateValue(issue.reportedAt, 'Reported date');
    const deliveredAt = dateValue(issue.deliveredAt, 'Delivered date');
    const withinWindow = daysBetween(deliveredAt, reportedAt) >= 0 && daysBetween(deliveredAt, reportedAt) <= 30;
    return {
      ...base,
      policyEligible: withinWindow,
      nextAction: withinWindow
        ? (issue.photosProvided === true ? 'review_replacement_or_refund' : 'request_minimum_photos')
        : 'review_applicable_law_outside_supplier_window'
    };
  }

  if (kind === 'transit_loss') {
    const reportedAt = dateValue(issue.reportedAt, 'Reported date');
    const estimatedDeliveryAt = dateValue(issue.estimatedDeliveryAt, 'Estimated delivery date');
    const elapsed = daysBetween(estimatedDeliveryAt, reportedAt);
    const withinWindow = elapsed >= 0 && elapsed <= 30;
    return {
      ...base,
      policyEligible: withinWindow,
      nextAction: withinWindow ? 'verify_tracking_then_replace_or_refund' : 'review_applicable_law_outside_supplier_window'
    };
  }

  if (kind === 'delay') {
    const reviewedAt = dateValue(issue.reviewedAt, 'Review date');
    const promisedShipAt = dateValue(issue.promisedShipAt, 'Promised ship date');
    const overdue = reviewedAt > promisedShipAt && !['shipped', 'fulfilled'].includes(printfulOrder.status);
    return {
      ...base,
      policyEligible: overdue,
      nextAction: overdue ? 'offer_delay_consent_or_full_refund' : 'monitor_until_promised_ship_date'
    };
  }

  const cancellable = cancellableStatuses.has(String(printfulOrder.status || '').toLowerCase());
  return {
    ...base,
    policyEligible: cancellable,
    nextAction: cancellable ? 'attempt_supplier_cancellation' : 'explain_fulfillment_already_started'
  };
}

