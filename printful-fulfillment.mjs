import { createHash } from 'node:crypto';

const sizes = new Set(['S', 'M', 'L']);

function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function positiveInteger(value, label) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1) throw new Error(`${label} must be a positive integer.`);
  return number;
}

function printfulExternalOrderId(stripeSessionId) {
  const digest = createHash('sha256').update(requiredText(stripeSessionId, 'Order ID')).digest('hex').slice(0, 24);
  return `ps_${digest}`;
}

export function buildPrintfulOrder(order, externalVariants) {
  const size = requiredText(order?.size, 'Size').toUpperCase();
  if (!sizes.has(size) || !externalVariants?.[size]) throw new Error('A configured Printful variant is required for the selected size.');

  const quantity = positiveInteger(order.quantity, 'Quantity');
  const amountTotal = positiveInteger(order.amountTotal, 'Amount total');
  const retailUnitAmount = positiveInteger(order.retailUnitAmount, 'Retail unit amount');
  const address = order.shipping?.address;
  if (!address) throw new Error('A shipping address is required for Printful fulfillment.');

  const recipient = {
    name: requiredText(order.customer?.name, 'Shipping name'),
    email: requiredText(order.customer?.email, 'Customer email'),
    phone: requiredText(order.customer?.phone, 'Customer phone'),
    address1: requiredText(address.line1, 'Shipping address line 1'),
    city: requiredText(address.city, 'Shipping city'),
    state_code: requiredText(address.state, 'Shipping state'),
    country_code: requiredText(address.country, 'Shipping country').toUpperCase(),
    zip: requiredText(address.postal_code, 'Shipping postal code')
  };
  if (typeof address.line2 === 'string' && address.line2.trim()) recipient.address2 = address.line2.trim();

  return {
    external_id: printfulExternalOrderId(order.orderId),
    shipping: 'STANDARD',
    recipient,
    items: [{
      external_variant_id: externalVariants[size],
      quantity,
      retail_price: (retailUnitAmount / 100).toFixed(2)
    }]
  };
}

export function printfulOrderPath(autoConfirm) {
  return `/orders?confirm=${autoConfirm === true}&update_existing=true`;
}

export async function submitPrintfulOrder(order, config, fetchImpl = fetch) {
  const payload = buildPrintfulOrder(order, config.externalVariants);
  const response = await fetchImpl(`https://api.printful.com${printfulOrderPath(config.autoConfirm)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requiredText(config.token, 'Printful token')}`,
      'Content-Type': 'application/json',
      'X-PF-Store-Id': requiredText(config.storeId, 'Printful store ID')
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result?.result || 'Printful rejected the order.');
  return result.result;
}
