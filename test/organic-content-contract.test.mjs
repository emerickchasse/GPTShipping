import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [sizeGuide, xmlSitemap, textSitemap, pagesWorkflow, indexNowScript, server, dockerfile] = await Promise.all([
  readFile(new URL('../bandana-size-guide.html', import.meta.url), 'utf8'),
  readFile(new URL('../sitemap.xml', import.meta.url), 'utf8'),
  readFile(new URL('../sitemap.txt', import.meta.url), 'utf8'),
  readFile(new URL('../.github/workflows/deploy-preview.yml', import.meta.url), 'utf8'),
  readFile(new URL('../scripts/submit-indexnow.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../server.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../Dockerfile', import.meta.url), 'utf8')
]);

const publicPages = ['index.html', 'care-guide.html', 'transparency.html', 'bandana-size-guide.html', 'measure-pet-for-bandana.html', 'how-to-tie-dog-bandana.html', 'tie-on-vs-over-collar-dog-bandana.html'];
const socialImageUrl = 'https://emerickchasse.github.io/GPTShipping/assets/printful/pet-parade-digital-mockup-v1.jpg';

test('the measurement guide is linked and discoverable in both sitemaps', () => {
  const relativeUrl = 'measure-pet-for-bandana.html';
  const canonicalUrl = `https://emerickchasse.github.io/GPTShipping/${relativeUrl}`;

  assert.match(sizeGuide, new RegExp(`href="${relativeUrl}"`));
  assert.match(xmlSitemap, new RegExp(`<loc>${canonicalUrl}</loc>`));
  assert.match(textSitemap, new RegExp(`^${canonicalUrl}$`, 'm'));
  assert.match(pagesWorkflow, new RegExp(`\\b${relativeUrl}\\b`));
  assert.match(indexNowScript, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(server, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(dockerfile, new RegExp(`\\b${relativeUrl}\\b`));
});

test('the digital product mockup is served by the container runtime', () => {
  const asset = 'assets/printful/pet-parade-digital-mockup-v1.jpg';
  assert.match(server, new RegExp(`['"]${asset.replaceAll('.', '\\.')}['"]`));
  assert.match(server, /'\.jpg': 'image\/jpeg'/);
  assert.match(dockerfile, /COPY --chown=node:node assets \.\/assets/);
});

test('the dog-bandana tying guide is published through every discovery surface', async () => {
  const relativeUrl = 'how-to-tie-dog-bandana.html';
  const canonicalUrl = `https://emerickchasse.github.io/GPTShipping/${relativeUrl}`;
  const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');

  assert.match(page, /How to tie a dog bandana/);
  assert.match(page, /not a collar or restraint/i);
  assert.match(page, /supervis/i);
  assert.match(xmlSitemap, new RegExp(`<loc>${canonicalUrl}</loc>`));
  assert.match(textSitemap, new RegExp(`^${canonicalUrl}$`, 'm'));
  assert.match(pagesWorkflow, new RegExp(`\\b${relativeUrl}\\b`));
  assert.match(indexNowScript, new RegExp(`['"]${relativeUrl}['"]`));
});

test('the tie-on versus over-collar guide is published through every discovery surface', async () => {
  const relativeUrl = 'tie-on-vs-over-collar-dog-bandana.html';
  const canonicalUrl = `https://emerickchasse.github.io/GPTShipping/${relativeUrl}`;
  const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');

  assert.match(page, /Tie-on vs\. over-collar dog bandanas/i);
  assert.match(page, /Pet Parade is a tie-on square/i);
  assert.match(page, /does not replace a collar/i);
  assert.match(xmlSitemap, new RegExp(`<loc>${canonicalUrl}</loc>`));
  assert.match(textSitemap, new RegExp(`^${canonicalUrl}$`, 'm'));
  assert.match(pagesWorkflow, new RegExp(`\\b${relativeUrl}\\b`));
  assert.match(indexNowScript, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(server, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(dockerfile, new RegExp(`\\b${relativeUrl}\\b`));
});

test('every indexable public page declares its exact canonical URL', async () => {
  for (const relativeUrl of publicPages) {
    const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');
    const canonicalUrl = relativeUrl === 'index.html'
      ? 'https://emerickchasse.github.io/GPTShipping/'
      : `https://emerickchasse.github.io/GPTShipping/${relativeUrl}`;

    assert.match(page, new RegExp(`<link rel="canonical" href="${canonicalUrl.replaceAll('.', '\\.')}"`), relativeUrl);
  }
});

test('every indexable public page has a complete, canonical social preview', async () => {
  for (const relativeUrl of publicPages) {
    const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');
    const canonicalUrl = relativeUrl === 'index.html'
      ? 'https://emerickchasse.github.io/GPTShipping/'
      : `https://emerickchasse.github.io/GPTShipping/${relativeUrl}`;

    assert.match(page, /<meta property="og:title" content="[^"]+" \/>/, relativeUrl);
    assert.match(page, /<meta property="og:description" content="[^"]+" \/>/, relativeUrl);
    assert.match(page, new RegExp(`<meta property="og:url" content="${canonicalUrl.replaceAll('.', '\\.')}`), relativeUrl);
    assert.match(page, new RegExp(`<meta property="og:image" content="${socialImageUrl.replaceAll('.', '\\.')}`), relativeUrl);
    assert.match(page, /<meta name="twitter:card" content="summary_large_image" \/>/, relativeUrl);
  }
});

test('the storefront exposes the decision-guide library without relying on desktop navigation', async () => {
  const storefront = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const decisionGuides = [
    'bandana-size-guide.html',
    'measure-pet-for-bandana.html',
    'how-to-tie-dog-bandana.html',
    'tie-on-vs-over-collar-dog-bandana.html'
  ];

  assert.match(storefront, /<section[^>]+id="guides"/);
  for (const guide of decisionGuides) {
    assert.match(storefront, new RegExp(`href="${guide.replaceAll('.', '\\.')}"`), guide);
  }
});
