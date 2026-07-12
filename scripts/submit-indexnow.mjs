import { readFile } from 'node:fs/promises';

const site = new URL('https://emerickchasse.github.io/GPTShipping/');
const key = '4a385d1729a145679725f7df42a21d91';
const keyLocation = new URL(`${key}.txt`, site);
const urls = [site, new URL('care-guide.html', site), new URL('transparency.html', site), new URL('bandana-size-guide.html', site), new URL('measure-pet-for-bandana.html', site), new URL('how-to-tie-dog-bandana.html', site), new URL('tie-on-vs-over-collar-dog-bandana.html', site)];

const keyFile = (await readFile(new URL(`../${key}.txt`, import.meta.url), 'utf8')).trim();
if (keyFile !== key) throw new Error('IndexNow key file does not match the configured key.');
if (urls.some((url) => url.origin !== site.origin || !url.pathname.startsWith(site.pathname))) {
  throw new Error('Refusing to submit a URL outside the configured storefront.');
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: site.host,
    key,
    keyLocation: keyLocation.href,
    urlList: urls.map((url) => url.href)
  })
});

if (response.status !== 200 && response.status !== 202) {
  throw new Error(`IndexNow rejected the submission with HTTP ${response.status}.`);
}

console.log(`IndexNow received ${urls.length} URLs (HTTP ${response.status}).`);
