# Acquisition evidence

Last reviewed: 2026-07-12

## Google Search Console

- Verified URL-prefix property: `https://emerickchasse.github.io/GPTShipping/`
- Verification method: permanent homepage `google-site-verification` meta tag
- Search performance report: rechecked at 19:20 EDT on 2026-07-12; Google still reports that data is processing and may take about one day. The query/page tables contain no data, so there are no attributable impressions or clicks yet.
- Aggregate page-indexing report: still processing with no usable reason or page counts.
- Homepage: indexed according to URL Inspection on 2026-07-12
- Organic size guide: indexed according to URL Inspection on 2026-07-12
- Cat bandana guide: initially unknown to Google; a live URL test on 2026-07-12 confirmed that Google can access and index it, then URL Inspection confirmed that it entered the priority crawl queue. This is not indexed-page, impression, click, or traffic evidence.
- Tie-on versus over-collar guide: Google reported the exact URL unknown and not indexed, with no referring sitemap or page detected. A live test at 19:20 EDT on 2026-07-12 confirmed `Google has access to this URL` and `The page can be indexed`; Search Console then confirmed `Indexing requested` and entry into the priority crawl queue. This is crawl-request evidence only, not indexation, ranking, impressions, clicks, or revenue.
- Sitemap submitted: `https://emerickchasse.github.io/GPTShipping/sitemap.xml`
- Current sitemap status: rechecked at 19:20 EDT on 2026-07-12 and still **Couldn't fetch** / unknown type / 0 discovered pages, despite a direct HTTP 200 response with `application/xml` and valid sitemap markup. Recheck in Search Console after processing; do not call the sitemap successful until Google reports success.
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
