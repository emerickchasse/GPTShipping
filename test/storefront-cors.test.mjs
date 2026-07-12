import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

test('the checkout API allows only the configured storefront origin', async (t) => {
  const port = 8194;
  const storefrontOrigin = 'https://emerickchasse.github.io';
  const server = spawn(process.execPath, ['server.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: String(port), PUBLIC_STOREFRONT_ORIGIN: storefrontOrigin },
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
});
