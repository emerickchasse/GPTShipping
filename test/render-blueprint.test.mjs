import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const blueprint = await readFile(new URL('../render.yaml', import.meta.url), 'utf8');
test('the Render Blueprint preserves on-commit deployment recovery', () => {
  assert.match(blueprint, /^\s+autoDeployTrigger: commit$/m);
  assert.doesNotMatch(blueprint, /^\s+autoDeployTrigger: checksPass$/m);
});
