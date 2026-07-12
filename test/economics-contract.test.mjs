import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [supplierResearch, operatingGuide, storefront] = await Promise.all([
  readFile(new URL('../docs/SUPPLIER_RESEARCH.md', import.meta.url), 'utf8'),
  readFile(new URL('../AGENTS.md', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8')
]);

test('the protected pilot economics distinguish price, shipping, cost, and goal order count', () => {
  for (const document of [supplierResearch, operatingGuide]) {
    assert.match(document, /USD 24\.99 product price/i);
    assert.match(document, /USD 4\.49 customer shipping/i);
    assert.match(document, /USD 29\.48 before tax/i);
    assert.match(document, /USD 14\.64 supplier subtotal/i);
    assert.match(document, /USD 14\.84 \(50\.3%\)/i);
    assert.match(document, /four non-refunded orders total USD 117\.92/i);
  }
});

test('the storefront keeps its price private until commerce readiness passes', () => {
  assert.match(storefront, /Price pending/);
  assert.doesNotMatch(storefront, /\$24\.99/);
});
