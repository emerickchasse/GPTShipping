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
  assert.match(script, /JSON\.stringify\(\{\s*quantity:\s*1,\s*size:\s*selectedSize,\s*source:\s*attributionSource\s*\}\)/);
  assert.match(script, /https:\/\/pawswipe-checkout\.onrender\.com/);
  assert.match(script, /fetch\(`\$\{checkoutApiBase\}\/api\/checkout-readiness`\)/);
  assert.match(script, /checkoutButton\.disabled\s*=\s*!readiness\.ready/);
  assert.match(script, /fetch\(`\$\{checkoutApiBase\}\/api\/checkout`/);
  assert.match(script, /if \(checkoutReady\)/);
  assert.match(script, /productPrice\.textContent/);
});

test('the product visual identifies the digital mockup without implying sample evidence', () => {
  assert.match(html, /assets\/printful\/pet-parade-digital-mockup-v1\.jpg/);
  assert.match(html, /Digital preview — physical sample not yet inspected\./);
});

test('the storefront answers verified purchase objections in visible FAQ content and structured data', () => {
  assert.match(html, /id="faq"/);
  assert.match(html, /Is Pet Parade a tie-on or over-collar bandana\?/);
  assert.match(html, /Are orders open now\?/);
  assert.match(html, /How do I choose a size\?/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /tie-on-vs-over-collar-dog-bandana\.html/);
  assert.match(html, /transparency\.html/);
});

test('the closed cart removes its controls from keyboard focus', () => {
  assert.match(html, /<aside id="cart"[^>]+aria-hidden="true"[^>]+inert/);
  assert.match(script, /cart\.inert = !open/);
});
