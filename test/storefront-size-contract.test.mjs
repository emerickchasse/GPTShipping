import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, script] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8')
]);

test('the storefront requires one verified size and carries it into cart and checkout', () => {
  assert.match(html, /<select[^>]+id="pet-size"[^>]+required/);
  assert.deepEqual(
    [...html.matchAll(/<option value="([SML])">/g)].map((match) => match[1]),
    ['S', 'M', 'L']
  );
  assert.match(html, /id="selected-size"/);
  assert.match(script, /selectedSize\s*=\s*sizeSelect\.value/);
  assert.match(script, /JSON\.stringify\(\{\s*quantity:\s*1,\s*size:\s*selectedSize\s*\}\)/);
  assert.match(script, /https:\/\/pawswipe-checkout\.onrender\.com/);
  assert.match(script, /fetch\(`\$\{checkoutApiBase\}\/api\/checkout-readiness`\)/);
  assert.match(script, /checkoutButton\.disabled\s*=\s*!readiness\.ready/);
  assert.match(script, /fetch\(`\$\{checkoutApiBase\}\/api\/checkout`/);
  assert.match(script, /if \(checkoutReady\)/);
  assert.match(script, /productPrice\.textContent/);
});
