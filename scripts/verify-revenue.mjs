import { normalizeAttributionSource } from '../commerce-policy.mjs';

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error('STRIPE_SECRET_KEY is required. Its value must stay out of source control and shell output.');
  process.exit(1);
}

const authorization = `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`;
async function stripeGet(path) {
  const response = await fetch(`https://api.stripe.com${path}`, { headers: { Authorization: authorization } });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || 'Stripe request failed.');
  return payload;
}

const paidOrders = [];
let cursor = '';
do {
  const page = await stripeGet(`/v1/checkout/sessions?status=complete&limit=100${cursor}`);
  for (const session of page.data) {
    if (!session.livemode || session.metadata?.store !== 'pawswipe' || session.payment_status !== 'paid' || session.currency !== 'usd') continue;
    const intent = await stripeGet(`/v1/payment_intents/${session.payment_intent}?expand[]=latest_charge`);
    const refunded = intent.latest_charge?.amount_refunded || 0;
    paidOrders.push({
      id: session.id,
      created: new Date(session.created * 1000).toISOString(),
      amountCents: Math.max(0, session.amount_total - refunded),
      refundedCents: refunded,
      attributionSource: normalizeAttributionSource(session.metadata?.attribution_source)
    });
  }
  cursor = page.has_more ? `&starting_after=${page.data.at(-1).id}` : '';
} while (cursor);

const revenueCents = paidOrders.reduce((total, order) => total + order.amountCents, 0);
const report = {
  currency: 'USD',
  verifiedRevenue: (revenueCents / 100).toFixed(2),
  target: '100.00',
  targetMet: revenueCents >= 10_000,
  orders: paidOrders
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.targetMet ? 0 : 2;
