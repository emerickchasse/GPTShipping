import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the runtime image copies every local module imported by server.mjs', async () => {
  const [serverSource, dockerfile] = await Promise.all([
    readFile(new URL('../server.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../Dockerfile', import.meta.url), 'utf8')
  ]);

  const localImports = [...serverSource.matchAll(/from ['"]\.\/(.+?)['"]/g)]
    .map((match) => match[1]);

  assert.ok(localImports.length > 0, 'server.mjs should expose local runtime imports to this contract test');
  for (const importedFile of localImports) {
    assert.match(
      dockerfile,
      new RegExp(`\\b${importedFile.replaceAll('.', '\\.') }\\b`),
      `Dockerfile must copy ${importedFile} into the runtime image`
    );
  }
});
