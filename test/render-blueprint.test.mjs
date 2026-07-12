import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const blueprint = await readFile(new URL('../render.yaml', import.meta.url), 'utf8');
const deployWorkflow = await readFile(new URL('../.github/workflows/deploy-render.yml', import.meta.url), 'utf8');

test('the Render Blueprint leaves deployment to the validated GitHub workflow', () => {
  assert.match(blueprint, /^\s+autoDeployTrigger: off$/m);
  assert.doesNotMatch(blueprint, /^\s+autoDeployTrigger: commit$/m);
  assert.doesNotMatch(blueprint, /^\s+autoDeployTrigger: checksPass$/m);
});

test('Render deployment is triggered only after the main validation workflow succeeds', () => {
  assert.match(deployWorkflow, /workflow_run:/);
  assert.match(deployWorkflow, /workflows:\s*\["Validate storefront"\]/);
  assert.match(deployWorkflow, /github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(deployWorkflow, /github\.event\.workflow_run\.head_branch == 'main'/);
  assert.match(deployWorkflow, /secrets\.RENDER_DEPLOY_HOOK_URL/);
});
