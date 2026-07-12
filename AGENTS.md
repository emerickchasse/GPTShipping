# GPTShipping operating guide

## Mission

Build and operate an English-language international dropshipping storefront. The business goal is USD 100 in **verified gross revenue**. Do not call the mission complete until the payments dashboard or order records show at least USD 100 received.

## Working rules

- Read `MEMORY.md`, inspect `git status --short`, and preserve existing changes before every task.
- Keep the customer-facing experience in English and do not make unsupported product, health, delivery, or sustainability claims.
- Record decisions, launch blockers, tests, and confirmed revenue in `MEMORY.md` immediately.
- Keep the live price, fulfilment cost, shipping regions, tax obligations, refund policy, and payment-provider status verified; never invent them.
- Every completed work session must end with a scoped git commit, after inspecting the diff and running proportionate checks.
- Keep reusable project process knowledge in `.codex/skills/`; revise it after a real mistake or newly discovered constraint.
- Every server-side module imported at runtime must be copied into the production image. Run the Docker runtime contract, build the image, and start it before publishing server changes.

## Launch gate

Before taking payment, configure a real payment provider, a verified product supplier, truthful shipping/returns pages, support contact, privacy/cookie notices where required, analytics consent handling, and a deployed HTTPS domain. Confirm the checkout from the buyer's perspective.

The current Printful manual/API store is `18458606` and the Pet Parade sync product is `445876313`. Verified external variant references are sufficient for the Orders API. The storefront now requires and preserves an S/M/L selection through the cart and checkout payload. Supplier publication alone is not checkout readiness: keep checkout closed until auto-confirm billing, tax, sample, support, and Stripe live-mode gates are verified.

The storefront product card uses `assets/printful/pet-parade-digital-mockup-v1.jpg`, generated from the exact approved pattern. It is a digital preview only and must retain the visible uninspected-sample disclosure; it is not physical quality evidence.

The protected Render environment now has a single-store Printful Orders token expiring 2028-07-11 plus the verified S/M/L references. Never copy the token into the repository or logs. `PRINTFUL_AUTO_CONFIRM` must remain false until merchant billing and the complete paid-order path are verified.

The protected pilot-market configuration is US-only with a USD 24.99 product price and USD 4.49 customer shipping, totaling USD 29.48 before tax. Against the USD 14.64 supplier subtotal, the pre-fee contribution is USD 14.84 (50.3%); four non-refunded orders total USD 117.92. These values are configured behind the disabled checkout gate, not public launch claims. Readiness still requires the Stripe secret and signed webhook plus the independent tax, billing, sample, and support approvals.

GitHub Pages must talk to Render only through the exact configured `PUBLIC_STOREFRONT_ORIGIN`. The public price and checkout button may switch from pending/disabled only after Render returns `ready:true`; CORS reachability or a reduced missing-settings count is never sufficient.

Campaign attribution is limited to the allowlisted `utm_source` label stored with a paid Stripe session. Unknown input becomes `direct`; never add third-party analytics, cookies, full referrers, URLs, or personal identifiers merely to measure acquisition.

All product-return links on decision guides must preserve one truthful source label end to end: `size_guide`, `measure_guide`, `tie_guide`, or `comparison_guide`. Do not reuse a nearby label for a different guide, and keep the server allowlist authoritative.

The organic library includes a tying guide with the `tie_guide` attribution label plus a tie-on-versus-over-collar construction comparison. Bing returned no usable volume for the researched phrases, so these pages are intent-coverage experiments rather than demand claims.

The homepage must expose the four product-decision guides (size, reference measurement, tying, and construction) in visible content that remains available when mobile navigation is hidden. Publication and sitemap presence are not substitutes for a visitor-reachable path from the offer.

The homepage FAQ must keep its visible answers and FAQPage structured data aligned. It may answer only verified product, sizing, launch-status, and safety facts; structured markup is not evidence of a search rich result or traffic.

Every indexable page must expose an exact canonical Open Graph URL, a factual title/description, the deployed Pet Parade mockup, and a large-image card declaration. Preview metadata improves link presentation but does not prove a post, impression, click, or sale.

Google URL Inspection currently confirms the homepage and `bandana-size-guide.html` are indexed. `care-guide.html`, `measure-pet-for-bandana.html`, and `transparency.html` were unknown to Google and have confirmed priority-crawl requests after live 200/self-canonical checks. Search Console performance and indexing summaries are still processing, while both submitted sitemaps still show fetch failure and zero discovered pages. Keep URL-level indexing, crawl requests, sitemap status, impressions, clicks, and sales as separate evidence.

Bing Webmaster Tools now lists the exact PawSwipe GitHub Pages property separately from unrelated account properties, but Bing currently returns `User is unauthorized to access the site`; ownership is not verified. Do not copy metrics from any other property or claim Bing indexing until the PawSwipe property itself provides evidence.

The browser checkout endpoint requires the exact GitHub Pages Origin or the API's own host before it parses the body or contacts Stripe. Do not weaken this to CORS headers alone, and do not apply the browser-origin rule to Stripe's separately signed webhook.

Render service `srv-d99md86cjfls738fdp70` uses on-commit deployment as the current fallback. Keep `render.yaml` aligned to `autoDeployTrigger: commit`. The deploy-hook experiment was removed after newly regenerated hooks returned HTTP 404; do not restore it without first proving a fresh hook directly and never expose hook values through full-page accessibility snapshots.

## Success evidence

Store a redacted record of paid order IDs, tax-exclusive amount, currency, and payment date in `MEMORY.md`. Gross revenue includes customer-paid product and shipping but excludes collected sales tax; subtract refunds conservatively. The target is met at USD 100.00 or more.

Use `npm run verify:revenue` (alias: `npm run revenue:verify`) for the live ledger probe. Never infer revenue when the protected Stripe key is unavailable.
