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

const publicPages = ['index.html', 'care-guide.html', 'transparency.html', 'customer-policies.html', 'bandana-size-guide.html', 'measure-pet-for-bandana.html', 'how-to-tie-dog-bandana.html', 'tie-on-vs-over-collar-dog-bandana.html', 'cat-bandana-guide.html'];
const socialImageUrl = 'https://emerickchasse.github.io/GPTShipping/assets/printful/pet-parade-digital-mockup-v1.jpg';
const supportFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScMEoMJRpmnazzQjWGQABXdtaUhWpuh5AkWX_d8kHjVblNDTA/viewform';
const launchFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfpOMdF9D2Sk7YYiIMDnnLD6Q-yQDkyrHnp2TqT5pi32NFzLg/viewform';

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

test('the indexed size guide targets the measured commercial size-chart intent', () => {
  assert.match(sizeGuide, /<title>Dog bandana size chart: S, M, or L\?/);
  assert.match(sizeGuide, /<h1>Dog bandana size chart: S, M, or L\?<\/h1>/);
  assert.match(sizeGuide, /"headline":"Dog bandana size chart: S, M, or L\?"/);
  assert.match(sizeGuide, /Bandana labels are not universal/);
  assert.match(sizeGuide, /Small pets; not adults/);
});

test('the digital product mockup is served by the container runtime', () => {
  const asset = 'assets/printful/pet-parade-digital-mockup-v1.jpg';
  assert.match(server, new RegExp(`['"]${asset.replaceAll('.', '\\.')}['"]`));
  assert.match(server, /'\.jpg': 'image\/jpeg'/);
  assert.match(dockerfile, /COPY --chown=node:node assets \.\/assets/);
});

test('Bing ownership proof ships through Pages and the container', async () => {
  const verification = await readFile(new URL('../BingSiteAuth.xml', import.meta.url), 'utf8');
  assert.match(verification, /<users>[\s\S]*<user>[A-F0-9]{32}<\/user>[\s\S]*<\/users>/);
  assert.match(pagesWorkflow, /\bBingSiteAuth\.xml\b/);
  assert.match(server, /'BingSiteAuth\.xml'/);
  assert.match(server, /'\.xml': 'application\/xml; charset=utf-8'/);
  assert.match(dockerfile, /\bBingSiteAuth\.xml\b/);
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

  assert.match(page, /Tie-on dog bandana vs\. over-collar styles/i);
  assert.match(page, /Pet Parade is a tie-on square/i);
  assert.match(page, /does not replace a collar/i);
  assert.match(page, /<title>Tie-on dog bandana vs\. over-collar/);
  assert.match(page, /<h1>Tie-on dog bandana vs\. over-collar/);
  assert.match(page, /"@type":"Article"/);
  assert.match(page, /"mainEntityOfPage":"https:\/\/emerickchasse\.github\.io\/GPTShipping\/tie-on-vs-over-collar-dog-bandana\.html"/);
  assert.match(xmlSitemap, new RegExp(`<loc>${canonicalUrl}</loc>`));
  assert.match(textSitemap, new RegExp(`^${canonicalUrl}$`, 'm'));
  assert.match(pagesWorkflow, new RegExp(`\\b${relativeUrl}\\b`));
  assert.match(indexNowScript, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(server, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(dockerfile, new RegExp(`\\b${relativeUrl}\\b`));
});

test('the cat bandana guide is factual and published through every discovery surface', async () => {
  const relativeUrl = 'cat-bandana-guide.html';
  const canonicalUrl = `https://emerickchasse.github.io/GPTShipping/${relativeUrl}`;
  const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');

  assert.match(page, /<title>Cat bandana guide:/);
  assert.match(page, /<h1>Cat bandana guide:/);
  assert.match(page, /44 cm/);
  assert.match(page, /not a collar or restraint/i);
  assert.match(page, /supervis/i);
  assert.match(page, /href="index\.html\?utm_source=cat_guide#shop"/);
  assert.match(xmlSitemap, new RegExp(`<loc>${canonicalUrl}</loc>`));
  assert.match(textSitemap, new RegExp(`^${canonicalUrl}$`, 'm'));
  assert.match(pagesWorkflow, new RegExp(`\\b${relativeUrl}\\b`));
  assert.match(indexNowScript, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(server, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(dockerfile, new RegExp(`\\b${relativeUrl}\\b`));
});

test('customer policies are public, sourced, and remain explicitly pre-launch', async () => {
  const relativeUrl = 'customer-policies.html';
  const canonicalUrl = `https://emerickchasse.github.io/GPTShipping/${relativeUrl}`;
  const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');
  const storefront = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const transparency = await readFile(new URL('../transparency.html', import.meta.url), 'utf8');

  assert.match(page, /Shipping policy/);
  assert.match(page, /Refund and replacement policy/);
  assert.match(page, /Privacy notice/);
  assert.match(page, /orders are not open/i);
  assert.match(page, /consent to the delay/i);
  assert.match(page, /9–11 business days/);
  assert.match(page, /Stripe shipping option will display that range before payment/);
  assert.match(page, /test payment-to-fulfilment-draft process have been verified/i);
  assert.doesNotMatch(page, /policy approval gate remains closed/i);
  assert.match(page, /full refund/i);
  assert.match(page, /within 30 days of delivery/i);
  assert.match(page, /within 30 days of the estimated delivery date/i);
  assert.match(page, /help\.printful\.com/);
  assert.match(page, /ftc\.gov/);
  assert.match(page, /six years from the end of the last tax year/i);
  assert.match(page, /24 months after the last activity/i);
  assert.match(page, /Stripe Checkout/);
  assert.match(page, /Printful receives the name, email, phone, shipping address/i);
  assert.match(page, /does not sell this data/i);
  assert.match(storefront, new RegExp(`href="${relativeUrl}"`));
  assert.match(transparency, new RegExp(`href="${relativeUrl}"`));
  assert.match(transparency, /test payment-to-draft process have been verified/i);
  assert.doesNotMatch(transparency, /has not yet adopted a final customer return policy/i);
  assert.match(xmlSitemap, new RegExp(`<loc>${canonicalUrl}</loc>`));
  assert.match(textSitemap, new RegExp(`^${canonicalUrl}$`, 'm'));
  assert.match(pagesWorkflow, new RegExp(`\\b${relativeUrl}\\b`));
  assert.match(indexNowScript, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(server, new RegExp(`['"]${relativeUrl}['"]`));
  assert.match(dockerfile, new RegExp(`\\b${relativeUrl}\\b`));
});

test('the privacy data map matches the checkout and fulfillment fields', async () => {
  const map = await readFile(new URL('../docs/PRIVACY_DATA_MAP.md', import.meta.url), 'utf8');
  const fulfillment = await readFile(new URL('../printful-fulfillment.mjs', import.meta.url), 'utf8');

  for (const field of ['billing address', 'shipping address', 'phone number', 'email/customer details', 'store', 'SKU', 'size', 'allowlisted attribution source']) {
    assert.match(map, new RegExp(field, 'i'), field);
  }
  for (const field of ['name', 'email', 'phone', 'line 1', 'line 2', 'city', 'state', 'country', 'postal code', 'quantity', 'retail unit price']) {
    assert.match(map, new RegExp(field, 'i'), field);
  }
  assert.match(server, /billing_address_collection: 'required'/);
  assert.match(server, /phone_number_collection\[enabled\]/);
  assert.match(server, /metadata\[attribution_source\]/);
  assert.match(fulfillment, /name: requiredText/);
  assert.match(fulfillment, /email: requiredText/);
  assert.match(fulfillment, /phone: requiredText/);
  assert.match(map, /six years from the end of the last tax year/i);
  assert.match(map, /Render Hobby runtime logs are available for 7 days/i);
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

test('the Atom guide feed is validly linked and published through every runtime', async () => {
  const feed = await readFile(new URL('../feed.xml', import.meta.url), 'utf8');
  const storefront = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const guidePages = ['bandana-size-guide.html', 'measure-pet-for-bandana.html', 'how-to-tie-dog-bandana.html', 'tie-on-vs-over-collar-dog-bandana.html', 'cat-bandana-guide.html'];

  assert.match(feed, /^<\?xml version="1\.0" encoding="utf-8"\?>/);
  assert.match(feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(feed, /rel="self" type="application\/atom\+xml"/);
  assert.equal((feed.match(/<entry>/g) || []).length, 6);
  assert.match(storefront, /<link rel="alternate" type="application\/atom\+xml"[^>]+href="feed\.xml"/);
  assert.match(storefront, /href="feed\.xml" type="application\/atom\+xml">Follow the guide feed without sharing an email<\/a>/);
  for (const relativeUrl of guidePages) {
    const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');
    assert.match(page, /<link rel="alternate" type="application\/atom\+xml"[^>]+href="feed\.xml"/, relativeUrl);
    assert.match(page, /href="feed\.xml" type="application\/atom\+xml">Follow the guide feed<\/a>/, relativeUrl);
    assert.match(feed, new RegExp(`<id>https://emerickchasse\\.github\\.io/GPTShipping/${relativeUrl.replaceAll('.', '\\.')}<\\/id>`), relativeUrl);
  }
  assert.match(pagesWorkflow, /\bfeed\.xml\b/);
  assert.match(server, /['"]feed\.xml['"]/);
  assert.match(dockerfile, /\bfeed\.xml\b/);
  assert.match(indexNowScript, /new URL\(['"]feed\.xml['"], site\)/);
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

test('public pages never expose the connected personal support mailbox', async () => {
  for (const relativeUrl of publicPages) {
    const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');
    assert.doesNotMatch(page, /chasse\.emerick|@gmail\.com/i, relativeUrl);
  }
});

test('private support uses the verified form without exposing the mailbox', async () => {
  const transparency = await readFile(new URL('../transparency.html', import.meta.url), 'utf8');
  const policies = await readFile(new URL('../customer-policies.html', import.meta.url), 'utf8');

  for (const [name, page] of [['transparency', transparency], ['policies', policies]]) {
    assert.match(page, new RegExp(`href="${supportFormUrl.replaceAll('.', '\\.')}"`), name);
    assert.match(page, /target="_blank" rel="noopener noreferrer"/, name);
    assert.match(page, /card number|card details/i, name);
    assert.doesNotMatch(page, /@gmail\.com|chasse\.emerick/i, name);
  }
});

test('launch notification is explicit, limited, and linked without exposing the mailbox', async () => {
  const storefront = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const transparency = await readFile(new URL('../transparency.html', import.meta.url), 'utf8');
  const policies = await readFile(new URL('../customer-policies.html', import.meta.url), 'utf8');
  const dataMap = await readFile(new URL('../docs/PRIVACY_DATA_MAP.md', import.meta.url), 'utf8');

  assert.match(storefront, new RegExp(`href="${launchFormUrl.replaceAll('.', '\\.')}"`));
  assert.match(storefront, /one launch notice/i);
  assert.match(storefront, /no newsletter, promotions, or tracking pixels/i);
  assert.match(policies, /validated email and required consent/i);
  assert.match(policies, /within 30 days after sending/i);
  assert.match(policies, /July 12, 2027/);
  assert.match(transparency, /one launch message/i);
  assert.match(dataMap, /Launch notification/);
  assert.match(dataMap, /no newsletter, promotion, profiling, advertising audience, or tracking pixel use/i);
  for (const page of [storefront, transparency, policies]) assert.doesNotMatch(page, /@gmail\.com|chasse\.emerick/i);
});

test('every decision guide offers the consent-limited launch notice', async () => {
  const decisionGuides = [
    'bandana-size-guide.html',
    'measure-pet-for-bandana.html',
    'how-to-tie-dog-bandana.html',
    'tie-on-vs-over-collar-dog-bandana.html',
    'cat-bandana-guide.html'
  ];

  for (const relativeUrl of decisionGuides) {
    const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');
    assert.ok(page.includes(`href="${launchFormUrl}"`), relativeUrl);
    assert.match(page, /Get one launch email/);
    assert.match(page, /No newsletter or promotions/);
  }
});

test('every commercial decision guide offers privacy-safe share intents', async () => {
  for (const relativeUrl of ['bandana-size-guide.html', 'measure-pet-for-bandana.html', 'how-to-tie-dog-bandana.html', 'tie-on-vs-over-collar-dog-bandana.html', 'cat-bandana-guide.html']) {
    const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');
    assert.match(page, /https:\/\/www\.pinterest\.com\/pin\/create\/button\//, relativeUrl);
    assert.match(page, /https:\/\/x\.com\/intent\/post\?/, relativeUrl);
    assert.match(page, /href="mailto:\?subject=/, relativeUrl);
    assert.match(page, /does not load social-media SDKs, pixels, or cookies/i, relativeUrl);
  }
});

test('the storefront exposes the decision-guide library without relying on desktop navigation', async () => {
  const storefront = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const decisionGuides = [
    'bandana-size-guide.html',
    'measure-pet-for-bandana.html',
    'how-to-tie-dog-bandana.html',
    'tie-on-vs-over-collar-dog-bandana.html',
    'cat-bandana-guide.html'
  ];

  assert.match(storefront, /<section[^>]+id="guides"/);
  for (const guide of decisionGuides) {
    assert.match(storefront, new RegExp(`href="${guide.replaceAll('.', '\\.')}"`), guide);
  }
});

test('every product return from a decision guide preserves its distinct attribution', async () => {
  const guideSources = new Map([
    ['bandana-size-guide.html', 'size_guide'],
    ['measure-pet-for-bandana.html', 'measure_guide'],
    ['how-to-tie-dog-bandana.html', 'tie_guide'],
    ['tie-on-vs-over-collar-dog-bandana.html', 'comparison_guide'],
    ['cat-bandana-guide.html', 'cat_guide']
  ]);

  for (const [relativeUrl, source] of guideSources) {
    const page = await readFile(new URL(`../${relativeUrl}`, import.meta.url), 'utf8');
    assert.doesNotMatch(page, /href="index\.html#shop"/, relativeUrl);
    assert.match(page, new RegExp(`href="index\\.html\\?utm_source=${source}#shop"`), relativeUrl);
  }
});

test('the storefront publishes a local favicon without a root-domain fallback', async () => {
  const storefront = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(storefront, /<link rel="icon" href="favicon\.svg" type="image\/svg\+xml" \/>/);
  assert.match(pagesWorkflow, /\bfavicon\.svg\b/);
  assert.match(server, /'favicon\.svg'/);
  assert.match(dockerfile, /\bfavicon\.svg\b/);
});

test('the homepage hero reuses the product mockup instead of the multi-megabyte pattern', async () => {
  const pivotStyles = await readFile(new URL('../pivot.css', import.meta.url), 'utf8');
  assert.match(pivotStyles, /\.bandana-shape[^}]+pet-parade-digital-mockup-v1\.jpg/);
  assert.doesNotMatch(pivotStyles, /\.bandana-shape[^}]+paw-pattern-v2\.png/);
});
