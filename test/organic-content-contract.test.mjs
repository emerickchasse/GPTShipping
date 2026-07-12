import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [sizeGuide, xmlSitemap, textSitemap] = await Promise.all([
  readFile(new URL('../bandana-size-guide.html', import.meta.url), 'utf8'),
  readFile(new URL('../sitemap.xml', import.meta.url), 'utf8'),
  readFile(new URL('../sitemap.txt', import.meta.url), 'utf8')
]);

test('the measurement guide is linked and discoverable in both sitemaps', () => {
  const relativeUrl = 'measure-pet-for-bandana.html';
  const canonicalUrl = `https://emerickchasse.github.io/GPTShipping/${relativeUrl}`;

  assert.match(sizeGuide, new RegExp(`href="${relativeUrl}"`));
  assert.match(xmlSitemap, new RegExp(`<loc>${canonicalUrl}</loc>`));
  assert.match(textSitemap, new RegExp(`^${canonicalUrl}$`, 'm'));
});
