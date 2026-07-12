import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const blueprint = await readFile(new URL('../render.yaml', import.meta.url), 'utf8');
test('the Render Blueprint preserves on-commit deployment recovery', () => {
  assert.match(blueprint, /^\s+autoDeployTrigger: commit$/m);
  assert.doesNotMatch(blueprint, /^\s+autoDeployTrigger: checksPass$/m);
});

test('the Render Blueprint keeps every human launch approval closed by default', () => {
  for (const key of [
    'PAWSWIPE_SAMPLE_APPROVED',
    'PAWSWIPE_SUPPLIER_BILLING_APPROVED',
    'PAWSWIPE_CUSTOMER_POLICIES_APPROVED',
    'PAWSWIPE_PRIVATE_SUPPORT_APPROVED'
  ]) {
    assert.match(blueprint, new RegExp(`- key: ${key}\\s+value: "false"`));
  }
});
