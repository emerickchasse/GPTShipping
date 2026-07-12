import { createServer } from 'node:http';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { normalizeAttributionSource, normalizeCheckoutMode, shouldFulfillStripeSession } from './commerce-policy.mjs';
import { submitPrintfulOrder } from './printful-fulfillment.mjs';

const root = resolve('.');
const port = Number(process.env.PORT || 8080);
const maxBodySize = 8 * 1024;
const publicFiles = new Set(['index.html', 'care-guide.html', 'bandana-size-guide.html', 'measure-pet-for-bandana.html', 'how-to-tie-dog-bandana.html', 'tie-on-vs-over-collar-dog-bandana.html', 'transparency.html', 'thank-you.html', 'favicon.svg', 'app.js', 'guide.js', 'styles.css', 'pivot.css', 'robots.txt', 'sitemap.xml', 'sitemap.txt', '4a385d1729a145679725f7df42a21d91.txt', 'assets/pawswipe-social.png', 'assets/printful/paw-pattern-v2.png', 'assets/printful/pet-parade-digital-mockup-v1.jpg']);
const checkoutRequiredVariables = [
  'STRIPE_CHECKOUT_MODE',
  'STRIPE_SECRET_KEY',
  'PUBLIC_BASE_URL',
  'PUBLIC_STOREFRONT_ORIGIN',
  'PAWSWIPE_PRODUCT_NAME',
  'PAWSWIPE_PRODUCT_DESCRIPTION',
  'PAWSWIPE_SKU',
  'PAWSWIPE_UNIT_AMOUNT_CENTS',
  'PAWSWIPE_SHIPPING_RATE_CENTS',
  'PAWSWIPE_ALLOWED_COUNTRIES',
  'STRIPE_WEBHOOK_SECRET',
  'PRINTFUL_API_TOKEN',
  'PRINTFUL_STORE_ID',
  'PRINTFUL_VARIANT_S',
  'PRINTFUL_VARIANT_M',
  'PRINTFUL_VARIANT_L',
  'PRINTFUL_AUTO_CONFIRM',
  'PAWSWIPE_SAMPLE_APPROVED',
  'PAWSWIPE_SUPPLIER_BILLING_APPROVED',
  'PAWSWIPE_CUSTOMER_POLICIES_APPROVED',
  'PAWSWIPE_PRIVATE_SUPPORT_APPROVED'
];
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function liveCommit() {
  const commit = process.env.RENDER_GIT_COMMIT?.trim().toLowerCase() || '';
  return /^[0-9a-f]{40}$/.test(commit) ? commit : null;
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(payload));
}

function applyStorefrontCors(request, response) {
  const allowedOrigin = process.env.PUBLIC_STOREFRONT_ORIGIN;
  if (allowedOrigin && request.headers.origin === allowedOrigin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Vary', 'Origin');
    return true;
  }
  return false;
}

function hasTrustedCheckoutOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return false;
  if (origin === process.env.PUBLIC_STOREFRONT_ORIGIN) return true;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}

function readBuffer(request, limit = maxBodySize) {
  return new Promise((resolveBody, reject) => {
    let size = 0;
    const chunks = [];
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('Request body is too large.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolveBody(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

async function readJson(request) {
  try {
    return JSON.parse((await readBuffer(request)).toString('utf8'));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('Request body must be valid JSON.');
    throw error;
  }
}

function asPositiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1) throw new Error(`${name} must be a positive integer.`);
  return number;
}

function checkoutReadiness() {
  const missing = checkoutRequiredVariables.filter((key) => !process.env[key]);
  const checkoutEnabled = process.env.LIVE_CHECKOUT_ENABLED === 'true';
  const stripeTaxEnabled = process.env.STRIPE_AUTOMATIC_TAX_ENABLED === 'true';
  let httpsConfigured = false;
  const printfulConfigured = Boolean(
    process.env.PRINTFUL_API_TOKEN &&
    process.env.PRINTFUL_STORE_ID &&
    process.env.PRINTFUL_VARIANT_S &&
    process.env.PRINTFUL_VARIANT_M &&
    process.env.PRINTFUL_VARIANT_L
  );
  const printfulAutoConfirm = process.env.PRINTFUL_AUTO_CONFIRM === 'true';
  const launchApprovals = {
    sample: process.env.PAWSWIPE_SAMPLE_APPROVED === 'true',
    supplierBilling: process.env.PAWSWIPE_SUPPLIER_BILLING_APPROVED === 'true',
    customerPolicies: process.env.PAWSWIPE_CUSTOMER_POLICIES_APPROVED === 'true',
    privateSupport: process.env.PAWSWIPE_PRIVATE_SUPPORT_APPROVED === 'true'
  };
  const launchApprovalsComplete = Object.values(launchApprovals).every(Boolean);
  try {
    httpsConfigured = new URL(process.env.PUBLIC_BASE_URL).protocol === 'https:';
  } catch {
    httpsConfigured = false;
  }
  const ready = checkoutEnabled && stripeTaxEnabled && httpsConfigured && printfulConfigured && printfulAutoConfirm && launchApprovalsComplete && missing.length === 0;
  return {
    ready,
    checkoutEnabled,
    stripeTaxEnabled,
    httpsConfigured,
    printfulConfigured,
    printfulAutoConfirm,
    launchApprovals,
    checkoutMode: process.env.STRIPE_CHECKOUT_MODE || null,
    missingConfigurationCount: missing.length,
    unitAmountCents: ready ? Number(process.env.PAWSWIPE_UNIT_AMOUNT_CENTS) : null,
    shippingAmountCents: ready ? Number(process.env.PAWSWIPE_SHIPPING_RATE_CENTS) : null
  };
}

function liveCheckoutConfig() {
  if (process.env.LIVE_CHECKOUT_ENABLED !== 'true') {
    throw new Error('Checkout is not live yet.');
  }

  const missing = checkoutRequiredVariables.filter((key) => !process.env[key]);
  if (missing.length) throw new Error('Checkout configuration is incomplete.');
  if (process.env.STRIPE_AUTOMATIC_TAX_ENABLED !== 'true') {
    throw new Error('Stripe Tax must be enabled before live checkout.');
  }

  const baseUrl = new URL(process.env.PUBLIC_BASE_URL);
  if (baseUrl.protocol !== 'https:') throw new Error('PUBLIC_BASE_URL must use HTTPS for live checkout.');
  const allowedCountries = process.env.PAWSWIPE_ALLOWED_COUNTRIES
    .split(',')
    .map((country) => country.trim().toUpperCase())
    .filter((country) => /^[A-Z]{2}$/.test(country));
  if (!allowedCountries.length) throw new Error('PAWSWIPE_ALLOWED_COUNTRIES must contain ISO two-letter codes.');
  const checkoutMode = normalizeCheckoutMode(process.env.STRIPE_CHECKOUT_MODE);

  return {
    baseUrl: baseUrl.origin,
    secretKey: process.env.STRIPE_SECRET_KEY,
    checkoutMode,
    productName: process.env.PAWSWIPE_PRODUCT_NAME,
    productDescription: process.env.PAWSWIPE_PRODUCT_DESCRIPTION,
    sku: process.env.PAWSWIPE_SKU,
    unitAmount: asPositiveInteger(process.env.PAWSWIPE_UNIT_AMOUNT_CENTS, 'PAWSWIPE_UNIT_AMOUNT_CENTS'),
    shippingAmount: Number(process.env.PAWSWIPE_SHIPPING_RATE_CENTS),
    allowedCountries,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    printful: {
      token: process.env.PRINTFUL_API_TOKEN,
      storeId: process.env.PRINTFUL_STORE_ID,
      autoConfirm: process.env.PRINTFUL_AUTO_CONFIRM === 'true',
      externalVariants: {
        S: process.env.PRINTFUL_VARIANT_S,
        M: process.env.PRINTFUL_VARIANT_M,
        L: process.env.PRINTFUL_VARIANT_L
      }
    }
  };
}

async function stripeRequest(path, options, secretKey) {
  const response = await fetch(`https://api.stripe.com${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      ...options.headers
    }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || 'Stripe request failed.');
  return payload;
}

async function createCheckoutSession(quantity, size, attributionSource) {
  const config = liveCheckoutConfig();
  if (!Number.isSafeInteger(config.shippingAmount) || config.shippingAmount < 0) {
    throw new Error('PAWSWIPE_SHIPPING_RATE_CENTS must be a non-negative integer.');
  }

  const form = new URLSearchParams({
    mode: 'payment',
    submit_type: 'pay',
    'automatic_tax[enabled]': 'true',
    billing_address_collection: 'required',
    'phone_number_collection[enabled]': 'true',
    'shipping_address_collection[allowed_countries][0]': config.allowedCountries[0],
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][product_data][name]': config.productName,
    'line_items[0][price_data][product_data][description]': config.productDescription,
    'line_items[0][price_data][unit_amount]': String(config.unitAmount),
    'line_items[0][quantity]': String(quantity),
    'shipping_options[0][shipping_rate_data][display_name]': 'Verified shipping',
    'shipping_options[0][shipping_rate_data][fixed_amount][amount]': String(config.shippingAmount),
    'shipping_options[0][shipping_rate_data][fixed_amount][currency]': 'usd',
    'metadata[store]': 'pawswipe',
    'metadata[sku]': `${config.sku}-${size.toLowerCase()}`,
    'metadata[size]': size,
    'metadata[attribution_source]': normalizeAttributionSource(attributionSource),
    success_url: `${config.baseUrl}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.baseUrl}/#shop`
  });
  config.allowedCountries.slice(1).forEach((country, index) => {
    form.set(`shipping_address_collection[allowed_countries][${index + 1}]`, country);
  });

  const stripePayload = await stripeRequest('/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': crypto.randomUUID()
    },
    body: form
  }, config.secretKey);
  if (!stripePayload.url) {
    throw new Error('Stripe could not create a checkout session. Review the server-side Stripe logs.');
  }
  return stripePayload.url;
}

function hasValidStripeSignature(rawBody, signatureHeader, webhookSecret) {
  if (!signatureHeader || !webhookSecret) return false;
  const parts = signatureHeader.split(',').map((part) => part.split('='));
  const timestamp = parts.find(([key]) => key === 't')?.[1];
  const signatures = parts.filter(([key]) => key === 'v1').map(([, value]) => value);
  if (!timestamp || !signatures.length || Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > 300) return false;
  const expected = createHmac('sha256', webhookSecret).update(`${timestamp}.${rawBody.toString('utf8')}`).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return signatures.some((signature) => {
    const candidate = Buffer.from(signature, 'hex');
    return candidate.length === expectedBuffer.length && timingSafeEqual(candidate, expectedBuffer);
  });
}

async function forwardPaidOrder(event) {
  const config = liveCheckoutConfig();
  const sessionId = event.data?.object?.id;
  if (!sessionId) throw new Error('Stripe webhook did not include a Checkout Session ID.');
  const session = await stripeRequest(`/v1/checkout/sessions/${sessionId}?expand[]=line_items`, { method: 'GET', headers: {} }, config.secretKey);
  if (!shouldFulfillStripeSession(session, config.checkoutMode)) return;

  const lineItems = session.line_items?.data || [];
  const quantity = lineItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const productSubtotal = lineItems.reduce((total, item) => total + Number(item.amount_subtotal ?? item.amount_total ?? 0), 0);
  await submitPrintfulOrder({
    orderId: session.id,
    sku: session.metadata.sku,
    size: session.metadata.size,
    quantity,
    currency: session.currency,
    amountTotal: session.amount_total,
    retailUnitAmount: Math.round(productSubtotal / quantity),
    customer: session.customer_details,
    shipping: session.collected_information?.shipping_details || session.shipping_details
  }, config.printful);
}

async function serveStatic(request, response, pathname) {
  const requested = pathname === '/' ? 'index.html' : pathname.slice(1);
  const filePath = resolve(root, requested);
  if (!filePath.startsWith(root) || requested.includes('..')) {
    sendJson(response, 400, { error: 'Invalid path.' });
    return;
  }
  if (!publicFiles.has(requested)) {
    sendJson(response, 404, { error: 'Not found.' });
    return;
  }
  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'self'"
    });
    response.end(content);
  } catch {
    sendJson(response, 404, { error: 'Not found.' });
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const storefrontOriginAllowed = applyStorefrontCors(request, response);
  if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/') && storefrontOriginAllowed) {
    response.writeHead(204);
    response.end();
    return;
  }
  if (request.method === 'GET' && url.pathname === '/api/checkout-readiness') {
    sendJson(response, 200, checkoutReadiness());
    return;
  }
  if (request.method === 'GET' && url.pathname === '/api/version') {
    sendJson(response, 200, { commit: liveCommit() });
    return;
  }
  if (request.method === 'POST' && url.pathname === '/api/stripe-webhook') {
    try {
      const rawBody = await readBuffer(request, 1024 * 1024);
      const config = liveCheckoutConfig();
      if (!hasValidStripeSignature(rawBody, request.headers['stripe-signature'], config.webhookSecret)) {
        sendJson(response, 400, { error: 'Invalid Stripe signature.' });
        return;
      }
      const event = JSON.parse(rawBody.toString('utf8'));
      if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
        await forwardPaidOrder(event);
      }
      sendJson(response, 200, { received: true });
    } catch (error) {
      console.error('Stripe webhook processing failed:', error.message);
      sendJson(response, 500, { error: 'Webhook processing failed.' });
    }
    return;
  }
  if (request.method === 'POST' && url.pathname === '/api/checkout') {
    if (!hasTrustedCheckoutOrigin(request)) {
      sendJson(response, 403, { error: 'Checkout origin is not allowed.' });
      return;
    }
    try {
      const body = await readJson(request);
      const quantity = asPositiveInteger(body.quantity, 'quantity');
      if (quantity > 3) throw new Error('Quantity cannot exceed 3 per checkout.');
      const size = typeof body.size === 'string' ? body.size.trim().toUpperCase() : '';
      if (!['S', 'M', 'L'].includes(size)) throw new Error('Size must be S, M, or L.');
      const checkoutUrl = await createCheckoutSession(quantity, size, body.source);
      sendJson(response, 200, { checkoutUrl });
    } catch (error) {
      const isUnavailable = error.message === 'Checkout is not live yet.';
      sendJson(response, isUnavailable ? 503 : 400, { error: error.message });
    }
    return;
  }
  if (request.method === 'GET' || request.method === 'HEAD') {
    await serveStatic(request, response, url.pathname);
    return;
  }
  sendJson(response, 405, { error: 'Method not allowed.' });
}).listen(port, () => {
  console.log(`PawSwipe storefront listening on http://localhost:${port}`);
});
