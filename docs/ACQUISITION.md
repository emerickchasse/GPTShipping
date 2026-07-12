# Acquisition evidence

Last reviewed: 2026-07-12

## Google Search Console

- Verified URL-prefix property: `https://emerickchasse.github.io/GPTShipping/`
- Verification method: permanent homepage `google-site-verification` meta tag
- Search performance and indexing reports: Google reports that data is processing and may take about one day
- Homepage: indexed according to URL Inspection on 2026-07-12
- Organic size guide: indexed according to URL Inspection on 2026-07-12
- Cat bandana guide: initially unknown to Google; a live URL test on 2026-07-12 confirmed that Google can access and index it, then URL Inspection confirmed that it entered the priority crawl queue. This is not indexed-page, impression, click, or traffic evidence.
- Sitemap submitted: `https://emerickchasse.github.io/GPTShipping/sitemap.xml`
- Current sitemap status: **Couldn't fetch** / 0 discovered pages, despite a direct HTTP 200 response with `application/xml` and valid sitemap markup. Recheck in Search Console after processing; do not call the sitemap successful until Google reports success.
- Text fallback submitted: `sitemap.txt`, using Google's documented plain-text format of one fully-qualified URL per UTF-8 line. Search Console also reports **Couldn't fetch**, type unknown, and 0 discovered pages.
- Direct QA for both formats passes, including requests using a Googlebot user agent: XML is HTTP 200 `application/xml` (441 bytes); text is HTTP 200 `text/plain; charset=utf-8` (235 bytes); robots is HTTP 200 and advertises both. Because two valid formats fail identically, stop repeated resubmission and recheck after Search Console finishes processing the new property.

## Other discovery

IndexNow accepted the current nine-URL list with HTTP 200. This proves API receipt only. It does not prove crawl, indexation, impressions, clicks, or revenue.

The size guide exposes direct Pinterest, X, and email share links without loading third-party SDKs or pixels. Pinterest, X, and Reddit were checked in authenticated Chrome on 2026-07-12 and all presented signed-out surfaces, so no post was created and no account identity was invented. A rendered share composer is distribution capability; only a visible published post or referral data proves distribution or traffic.

## Evidence rules

- Count a page as indexed only when Search Console reports it indexed or a live Google result confirms it.
- Count acquisition only from Search Console impressions/clicks or another privacy-reviewed first-party source.
- Never count an indexing request, sitemap submission, bot fetch, or page view as a sale.
- Revenue remains authoritative only through paid, non-refunded live Stripe sessions recorded in `MEMORY.md`.
