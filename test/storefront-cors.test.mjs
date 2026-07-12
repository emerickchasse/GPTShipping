import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('the checkout API allows only the configured storefront origin', async (t) => {
  const port = 8194;
  const storefrontOrigin = 'https://emerickchasse.github.io';
  const server = spawn(process.execPath, ['server.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: String(port), PUBLIC_STOREFRONT_ORIGIN: storefrontOrigin, RENDER_GIT_COMMIT: 'a'.repeat(40) },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(() => server.kill());
  await once(server.stdout, 'data');

  const allowed = await fetch(`http://127.0.0.1:${port}/api/checkout-readiness`, {
    headers: { Origin: storefrontOrigin }
  });
  assert.equal(allowed.headers.get('access-control-allow-origin'), storefrontOrigin);

  const denied = await fetch(`http://127.0.0.1:${port}/api/checkout-readiness`, {
    headers: { Origin: 'https://attacker.example' }
  });
  assert.equal(denied.headers.get('access-control-allow-origin'), null);

  const versionResponse = await fetch(`http://127.0.0.1:${port}/api/version`);
  assert.equal(versionResponse.status, 200);
  assert.deepEqual(await versionResponse.json(), { commit: 'a'.repeat(40) });

  const preflight = await fetch(`http://127.0.0.1:${port}/api/checkout`, {
    method: 'OPTIONS',
    headers: {
      Origin: storefrontOrigin,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type'
    }
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-methods'), 'GET, POST, OPTIONS');
  assert.equal(preflight.headers.get('access-control-allow-headers'), 'Content-Type');

  const orderBody = JSON.stringify({ quantity: 1, size: 'M', source: 'direct' });
  const foreignCheckout = await fetch(`http://127.0.0.1:${port}/api/checkout`, {
    method: 'POST',
    headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' },
    body: orderBody
  });
  assert.equal(foreignCheckout.status, 403);

  const missingOriginCheckout = await fetch(`http://127.0.0.1:${port}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: orderBody
  });
  assert.equal(missingOriginCheckout.status, 403);

  const sameOriginCheckout = await fetch(`http://127.0.0.1:${port}/api/checkout`, {
    method: 'POST',
    headers: { Origin: `http://127.0.0.1:${port}`, 'Content-Type': 'application/json' },
    body: orderBody
  });
  assert.equal(sameOriginCheckout.status, 503);
});

test('technical credentials cannot bypass human launch approvals', async (t) => {
  const port = 8195;
  const technicalConfig = {
    PORT: String(port),
    STRIPE_CHECKOUT_MODE: 'live',
    STRIPE_SECRET_KEY: 'sk_live_fake',
    PUBLIC_BASE_URL: 'https://checkout.example',
    PUBLIC_STOREFRONT_ORIGIN: 'https://storefront.example',
    PAWSWIPE_PRODUCT_NAME: 'Pet Parade',
    PAWSWIPE_PRODUCT_DESCRIPTION: 'Test product',
    PAWSWIPE_SKU: 'PP-001',
    PAWSWIPE_UNIT_AMOUNT_CENTS: '2499',
    PAWSWIPE_SHIPPING_RATE_CENTS: '449',
    PAWSWIPE_ALLOWED_COUNTRIES: 'US',
    STRIPE_WEBHOOK_SECRET: 'whsec_fake',
    PRINTFUL_API_TOKEN: 'printful_fake',
    PRINTFUL_STORE_ID: '18458606',
    PRINTFUL_VARIANT_S: 's',
    PRINTFUL_VARIANT_M: 'm',
    PRINTFUL_VARIANT_L: 'l',
    PRINTFUL_AUTO_CONFIRM: 'true',
    LIVE_CHECKOUT_ENABLED: 'true',
    STRIPE_AUTOMATIC_TAX_ENABLED: 'true'
  };
  const server = spawn(process.execPath, ['server.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, ...technicalConfig },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(() => server.kill());
  await once(server.stdout, 'data');

  const response = await fetch(`http://127.0.0.1:${port}/api/checkout-readiness`);
  const readiness = await response.json();
  assert.equal(readiness.ready, false);
  assert.deepEqual(readiness.launchApprovals, {
    sample: false,
    supplierBilling: false,
    customerPolicies: false,
    privateSupport: false
  });
  server.kill();
  await once(server, 'exit');

  const approvedServer = spawn(process.execPath, ['server.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: {
      ...process.env,
      ...technicalConfig,
      PORT: String(port + 1),
      PAWSWIPE_SAMPLE_APPROVED: 'true',
      PAWSWIPE_SUPPLIER_BILLING_APPROVED: 'true',
      PAWSWIPE_CUSTOMER_POLICIES_APPROVED: 'true',
      PAWSWIPE_PRIVATE_SUPPORT_APPROVED: 'true'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  t.after(() => approvedServer.kill());
  await once(approvedServer.stdout, 'data');
  const approvedResponse = await fetch(`http://127.0.0.1:${port + 1}/api/checkout-readiness`);
  assert.equal((await approvedResponse.json()).ready, true);
});
