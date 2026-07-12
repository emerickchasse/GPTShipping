import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const blueprint = await readFile(new URL('../render.yaml', import.meta.url), 'utf8');
const environmentExample = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
test('the Render Blueprint preserves on-commit deployment recovery', () => {
  assert.match(blueprint, /^\s+autoDeployTrigger: commit$/m);
  assert.doesNotMatch(blueprint, /^\s+autoDeployTrigger: checksPass$/m);
});

test('the Render Blueprint records only the evidenced private-support approval', () => {
  for (const key of [
    'PAWSWIPE_SAMPLE_APPROVED',
    'PAWSWIPE_SUPPLIER_BILLING_APPROVED',
    'PAWSWIPE_CUSTOMER_POLICIES_APPROVED'
  ]) {
    assert.match(blueprint, new RegExp(`- key: ${key}\\s+value: "false"`));
  }
  assert.match(blueprint, /- key: PAWSWIPE_PRIVATE_SUPPORT_APPROVED\s+value: "true"/);
});

test('the public environment template defaults every human approval closed', () => {
  for (const key of [
    'PAWSWIPE_SAMPLE_APPROVED',
    'PAWSWIPE_SUPPLIER_BILLING_APPROVED',
    'PAWSWIPE_CUSTOMER_POLICIES_APPROVED',
    'PAWSWIPE_PRIVATE_SUPPORT_APPROVED'
  ]) {
    assert.match(environmentExample, new RegExp(`^${key}=false$`, 'm'));
  }
});
