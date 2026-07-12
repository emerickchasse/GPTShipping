import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = resolve('.');
const port = Number(process.env.PORT || 8080);
const maxBodySize = 8 * 1024;
const publicFiles = new Set(['index.html', 'thank-you.html', 'app.js', 'styles.css']);
const checkoutRequiredVariables = [
  'STRIPE_SECRET_KEY',
  'PUBLIC_BASE_URL',
  'PAWSWIPE_PRODUCT_NAME',
  'PAWSWIPE_PRODUCT_DESCRIPTION',
  'PAWSWIPE_SKU',
  'PAWSWIPE_UNIT_AMOUNT_CENTS',
  'PAWSWIPE_SHIPPING_RATE_CENTS',
  'PAWSWIPE_ALLOWED_COUNTRIES'
];
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolveBody, reject) => {
    let size = 0;
    const chunks = [];
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBodySize) {
        reject(new Error('Request body is too large.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
    request.on('error', reject);
  });
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
  try {
    httpsConfigured = new URL(process.env.PUBLIC_BASE_URL).protocol === 'https:';
  } catch {
    httpsConfigured = false;
  }
  return {
    ready: checkoutEnabled && stripeTaxEnabled && httpsConfigured && missing.length === 0,
    checkoutEnabled,
    stripeTaxEnabled,
    httpsConfigured,
    missingConfigurationCount: missing.length
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

  return {
    baseUrl: baseUrl.origin,
    secretKey: process.env.STRIPE_SECRET_KEY,
    productName: process.env.PAWSWIPE_PRODUCT_NAME,
    productDescription: process.env.PAWSWIPE_PRODUCT_DESCRIPTION,
    sku: process.env.PAWSWIPE_SKU,
    unitAmount: asPositiveInteger(process.env.PAWSWIPE_UNIT_AMOUNT_CENTS, 'PAWSWIPE_UNIT_AMOUNT_CENTS'),
    shippingAmount: Number(process.env.PAWSWIPE_SHIPPING_RATE_CENTS),
    allowedCountries
  };
}

async function createCheckoutSession(quantity) {
  const config = liveCheckoutConfig();
  if (!Number.isSafeInteger(config.shippingAmount) || config.shippingAmount < 0) {
    throw new Error('PAWSWIPE_SHIPPING_RATE_CENTS must be a non-negative integer.');
  }

  const form = new URLSearchParams({
    mode: 'payment',
    submit_type: 'pay',
    'automatic_tax[enabled]': 'true',
    billing_address_collection: 'required',
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
    'metadata[sku]': config.sku,
    success_url: `${config.baseUrl}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.baseUrl}/#shop`
  });
  config.allowedCountries.slice(1).forEach((country, index) => {
    form.set(`shipping_address_collection[allowed_countries][${index + 1}]`, country);
  });

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': crypto.randomUUID()
    },
    body: form
  });
  const stripePayload = await stripeResponse.json();
  if (!stripeResponse.ok || !stripePayload.url) {
    throw new Error('Stripe could not create a checkout session. Review the server-side Stripe logs.');
  }
  return stripePayload.url;
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
  if (request.method === 'GET' && url.pathname === '/api/checkout-readiness') {
    sendJson(response, 200, checkoutReadiness());
    return;
  }
  if (request.method === 'POST' && url.pathname === '/api/checkout') {
    try {
      const body = await readJson(request);
      const quantity = asPositiveInteger(body.quantity, 'quantity');
      if (quantity > 3) throw new Error('Quantity cannot exceed 3 per checkout.');
      const checkoutUrl = await createCheckoutSession(quantity);
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
