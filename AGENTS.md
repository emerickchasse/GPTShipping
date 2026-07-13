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

Four human approvals are executable readiness gates and default false: `PAWSWIPE_SAMPLE_APPROVED`, `PAWSWIPE_SUPPLIER_BILLING_APPROVED`, `PAWSWIPE_CUSTOMER_POLICIES_APPROVED`, and `PAWSWIPE_PRIVATE_SUPPORT_APPROVED`. Never set one true from documentation or configuration alone; each requires current real-world evidence for its named gate.

Server enforcement must match the readiness surface: `/api/checkout` returns 503 before contacting Stripe unless complete readiness is true. Paid webhook recovery may still create an idempotent Printful draft, but `confirm=true` is impossible unless both `PRINTFUL_AUTO_CONFIRM=true` and `PAWSWIPE_SUPPLIER_BILLING_APPROVED=true`.

Signed Stripe test-event recovery must work independently of new-checkout activation. `LIVE_CHECKOUT_ENABLED=false` and `STRIPE_AUTOMATIC_TAX_ENABLED=false` continue to block session creation, but they must not turn a valid test webhook into HTTP 500 before Stripe session verification. Keep this separation covered by the signed webhook regression.

`customer-policies.html` is the approved US-pilot operating policy. Keep the merchant's obligations separate from Printful reimbursement: supported defect and loss claims describe PawSwipe remedies, FTC shipping-delay rights remain intact, and supplier limitations never waive applicable customer rights. The gate became true only after private support, retention disclosures, a visibly rendered 9–11-business-day Stripe test checkout, a paid test session, a signed webhook, and a matching unconfirmed Printful draft were verified on 2026-07-12. This does not approve sample quality, supplier billing, tax, or live checkout.

`docs/PRIVACY_DATA_MAP.md` is the implementation contract for hosting, support, Stripe, and Printful data. Keep it synchronized with every collected field and public disclosure. Routine support records have a 24-month schedule; transaction and fulfillment records follow the CRA six-year rule. Provider-purpose retention is not a PawSwipe-controlled fixed promise. Privacy completeness alone does not approve customer policies while the pre-payment delivery estimate and remedy execution remain unverified.

`docs/SHIPPING_OPERATIONS.md` records the authenticated US estimate and operating drill. Printful showed 9-11 business days for S, M, and L on 2026-07-12. Keep the two required delivery-range variables synchronized with current supplier evidence and Stripe's structured shipping estimate. The visible paid test and matching draft closed the customer-policy gate only; it did not approve an actual delivery, sample, supplier billing, tax, or live checkout.

Use `docs/ORDER_REMEDY.md` and `npm run drill:remedy -- <private-case.json>` for payment-to-fulfillment case routing. Inputs are private and must stay outside Git. The tool must never echo raw session/customer data or mutate providers. Synthetic drill success is not provider-backed evidence, so it cannot approve customer policies by itself.

The private support gate is approved. A public Google Form provides anonymous access without exposing the connected Gmail mailbox, collects only the disclosed support fields, requires privacy confirmation, sends owner notifications, routes into `PawSwipe Support`, and passed a complete test submission and acknowledgement loop. Never publish the mailbox or routing alias. Follow `docs/SUPPORT_OPERATIONS.md` and keep the form, notifications, one-US-business-day review target, policy disclosure, and testable reply path intact.

The optional pre-launch list follows `docs/LAUNCH_NOTIFICATIONS.md`. It collects only a validated email and required consent for one launch email, with no newsletter, promotion, profiling, advertising audience, or tracking pixel. Delete addresses within 30 days after sending, earlier on verified request, or by 2027-07-12 if launch has not occurred and consent was not renewed. Never store subscriber addresses or counts in the repository or memory.

Every decision guide must offer that same consent-limited launch notice near its product return. Keep the closed-order disclosure adjacent, link directly to the verified form, and do not substitute a newsletter, promotion list, embedded tracker, or implied checkout. This gives pre-launch organic visitors one safe conversion path while payments remain closed.

Every commercial decision guide also exposes direct Pinterest, X, and email share intents. Keep each canonical guide URL and factual topic-specific copy paired correctly, use no social SDK/pixel/cookie, and preserve `noopener noreferrer` on external composers. A composer is capability only; do not record it as distribution, traffic, or revenue.

GitHub Discussion `#4` is PawSwipe's public English feedback surface. Keep it distinct from private support: reading is public, posting requires GitHub, and the public copy must prohibit personal, payment, order, credential, identification, and support-case data. The repository description and homepage must continue to identify the live PawSwipe preview truthfully. A published discussion is community capability, not a reader, reply, visit, or sale.

The Discussion-to-storefront link uses `utm_source=github`, already normalized by the existing privacy-safe attribution allowlist. Keep the homepage-to-Discussion loop visible beside the guide library and retain the public/privacy warning on both ends. Do not add discussion usernames, referrers, full URLs, or comment content to commerce metadata.

The GitHub repository landing page is an acquisition surface. Keep its description, live homepage, topics, README mockup disclaimer, complete guide index, Atom link, community link, and `github` storefront attribution synchronized. GitHub traffic endpoints may provide aggregate views/clones/referrers only; zero traffic is an observation, not justification to fabricate engagement.

`feed.xml` is the canonical Atom discovery surface for the homepage and commercial decision guides. Keep its self link, entry IDs, alternate links, summaries, and timestamps factual; update its Pages, Render, Docker, IndexNow, and HTML autodiscovery contracts together. Feed publication is syndication capability, not a subscriber, crawl, citation, visit, or sale.

The owner authenticated the existing Stripe `SiteQC` account on 2026-07-12. It is CAD-based, has prior live payout history, and its incomplete profile guide is prefilled for the unrelated `siteqc.ca` business. Protected Render contains test-only payment and webhook credentials; checkout remains closed. Follow `docs/PAYMENT_OPERATIONS.md`. Never overwrite an existing merchant profile with PawSwipe facts, invent a legal/business description, inspect a full API-key-page accessibility snapshot, pair test credentials with live mode, or treat dashboard access as PawSwipe activation or revenue.

The current Printful manual/API store is `18458606` and the Pet Parade sync product is `445876313`. Verified external variant references are sufficient for the Orders API. The storefront now requires and preserves an S/M/L selection through the cart and checkout payload. The account currently has no billing method and all visible currency wallets are zero with automatic funding disabled. Supplier publication and an unconfirmed test draft are not checkout readiness: keep checkout closed until billing, tax, sample, and Stripe live-mode gates are verified.

The storefront product card uses `assets/printful/pet-parade-digital-mockup-v1.jpg`, generated from the exact approved pattern. It is a digital preview only and must retain the visible uninspected-sample disclosure; it is not physical quality evidence.

The homepage hero reuses that same mockup asset rather than loading the 1.38 MB production-pattern PNG. Keep the lossless pattern available for supplier production and guide banners, but out of the homepage request graph unless a measured need outweighs the transfer cost.

The protected Render environment now has a single-store Printful Orders token expiring 2028-07-11 plus the verified S/M/L references. Never copy the token into the repository or logs. `PRINTFUL_AUTO_CONFIRM` must remain false until merchant billing and the complete paid-order path are verified.

Printful's current dashboard may omit the API-created template from `Mes produits` even while the verified file and sync references remain evidenced. Never rebuild or overwrite template `104922382` from editor defaults: applying file `1014307040` directly produced only `Okay / 46 DPI`, while the verified regular-repeat 30% template is `Good / 152 DPI`. Preserve the proven template/sync/variant references until the provider API or an order proves an exact replacement.

Before treating a missing Printful template card as a missing product, inspect the store-specific `Publié` tab. Store `18458606` currently exposes sync product `445876313` and all three external references there. Its exact M line editor proves regular repeat, 30% scale, `Good / 152 DPI`, and white stitching. A sample-order draft exists at C$11.60 before shipping/tax; it is not an order, charge, delivered sample, or approval.

The protected pilot-market configuration is US-only with a USD 24.99 product price and USD 4.49 customer shipping, totaling USD 29.48 before tax. Against the USD 14.64 supplier subtotal, the pre-fee contribution is USD 14.84 (50.3%); four non-refunded orders total USD 117.92. These values are configured behind the disabled checkout gate, not public launch claims. Test Stripe/webhook credentials are present, customer policies and support are approved, and readiness still requires independent live payment, tax, billing, sample, auto-confirm, and checkout approvals.

The connected SiteQC Stripe account has an unrelated default tax category for personal-use SaaS. PawSwipe must never inherit it. `PAWSWIPE_PRODUCT_TAX_CODE` is required and currently fixed to `txcd_99999999` (General - Tangible Goods) on the physical bandana line item. Keep `STRIPE_AUTOMATIC_TAX_ENABLED=false` until authoritative registrations and merchant facts exist; an active Stripe Tax screen or automatically calculated amount is not registration/remittance evidence.

Tax registration and merchant-account ownership are separate human approvals: `PAWSWIPE_TAX_APPROVED` and `PAWSWIPE_MERCHANT_ACCOUNT_APPROVED`. Both default false and are required by server readiness. Never infer either from automatic-tax configuration, test/live credentials, the pre-existing SiteQC payout, or a technically complete environment.

The homepage is the sole target for the measured `pet bandana` category (DataForSEO US English: 1,000 monthly searches; transactional probability 0.476 on 2026-07-12). Keep the category wording paired with the factual cat-and-dog print and explicit closed-order status; do not turn a category estimate into an international-demand claim.

Use `cat-bandana-guide.html` for the measured `cat bandana` intent (DataForSEO US English: 1,900 monthly searches on 2026-07-12) without converting it into a second product page. Keep its advice limited to the verified square dimensions, comparison against an already tolerated accessory, supervision, and the fact that S is not a cat-specific fit guarantee. Preserve `cat_guide` attribution on every product return.

Use `dog-bandana-material-guide.html` as the sole target for `dog bandana material` (DataForSEO US English: 720 monthly searches, transactional intent, checked 2026-07-12). Keep composition and weight separated by US/Mexico versus EU/Latvia, cite Printful product code 655, disclose microfibre release and single-sided/double-folded construction, and never convert supplier specifications into sample quality, comfort, durability, or performance claims. Preserve `material_guide` attribution.

Topic-specific public discussions must link back to the exact canonical guide, preserve closed-order language and prohibited-data boundaries, and have a reciprocal guide link so the community route is not orphaned.

GitHub Pages must talk to Render only through the exact configured `PUBLIC_STOREFRONT_ORIGIN`. The public price and checkout button may switch from pending/disabled only after Render returns `ready:true`; CORS reachability or a reduced missing-settings count is never sufficient.

Campaign attribution is limited to the allowlisted `utm_source` label stored with a paid Stripe session. Unknown input becomes `direct`; never add third-party analytics, cookies, full referrers, URLs, or personal identifiers merely to measure acquisition.

All product-return links on decision guides must preserve one truthful source label end to end: `size_guide`, `measure_guide`, `tie_guide`, or `comparison_guide`. Do not reuse a nearby label for a different guide, and keep the server allowlist authoritative.

The organic library includes a tying guide with the `tie_guide` attribution label plus a tie-on-versus-over-collar construction comparison. Bing returned no usable volume for the researched phrases, so these pages are intent-coverage experiments rather than demand claims.

DataForSEO's 2026-07-12 US English snapshot reports `tie on dog bandana` at 720 monthly searches with transactional intent probability 0.771. Use the single comparison URL for that intent; do not create a competing landing page or present US keyword volume as international traffic.

The same snapshot reports `dog bandana size chart` at 720 monthly searches with commercial intent probability 0.656. Keep `bandana-size-guide.html` as the sole target and preserve its verified S/M/L table, non-universal-label warning, and small-pet limitation.

The homepage must expose the four product-decision guides (size, reference measurement, tying, and construction) in visible content that remains available when mobile navigation is hidden. Publication and sitemap presence are not substitutes for a visitor-reachable path from the offer.

Treat the public Lighthouse report as external diagnostic evidence, not a traffic signal. Keep the closed cart inert as well as `aria-hidden`, maintain WCAG contrast for small card labels, and publish the project favicon through Pages, Render, and Docker allowlists.

The homepage FAQ must keep its visible answers and FAQPage structured data aligned. It may answer only verified product, sizing, launch-status, and safety facts; structured markup is not evidence of a search rich result or traffic.

Do not publish a homepage Product JSON-LD entity while checkout, public offer, sample, and customer evidence remain unavailable. Google requires at least `offers`, `review`, or `aggregateRating` for Product snippets; omitting all three produces a critical invalid item, while inventing any of them would be worse. Keep the factual product copy visible in HTML until eligible commerce evidence exists.

Every indexable page must expose an exact canonical Open Graph URL, a factual title/description, the deployed Pet Parade mockup, and a large-image card declaration. Preview metadata improves link presentation but does not prove a post, impression, click, or sale.

Google URL Inspection currently confirms the homepage and `bandana-size-guide.html` are indexed. `care-guide.html`, `measure-pet-for-bandana.html`, and `transparency.html` were unknown to Google and have confirmed priority-crawl requests after live 200/self-canonical checks. Search Console performance and indexing summaries are still processing, while both submitted sitemaps still show fetch failure and zero discovered pages. Keep URL-level indexing, crawl requests, sitemap status, impressions, clicks, and sales as separate evidence.

`cat-bandana-guide.html` passed Google's live URL test and entered the priority crawl queue on 2026-07-12, but it was not indexed at inspection time. Pinterest, X, and Reddit were simultaneously signed out; never create identities or claim social distribution from those surfaces.

Bing Webmaster Tools now verifies the exact PawSwipe GitHub Pages property through its property-specific `BingSiteAuth.xml`, tracked through Pages, Render, and Docker publication contracts. The XML sitemap is submitted and processing; all nine public URLs have URL Submission receipts. Keep ownership, submission, crawl, indexation, performance, AI citations, clicks, and sales as separate evidence, and never copy metrics from another property.

The browser checkout endpoint requires the exact GitHub Pages Origin or the API's own host before it parses the body or contacts Stripe. Do not weaken this to CORS headers alone, and do not apply the browser-origin rule to Stripe's separately signed webhook.

Render service `srv-d99md86cjfls738fdp70` uses on-commit deployment as the current fallback. Keep `render.yaml` aligned to `autoDeployTrigger: commit`. The deploy-hook experiment was removed after newly regenerated hooks returned HTTP 404; do not restore it without first proving a fresh hook directly and never expose hook values through full-page accessibility snapshots.

Render exposes its official `RENDER_GIT_COMMIT` through `/api/version` only after strict full-SHA validation. Compare the live value with the intended commit using `npm run verify:deployment -- <full-sha>`; readiness and HTTP 200 do not prove code freshness.

## Success evidence

Store a redacted record of paid order IDs, tax-exclusive amount, currency, and payment date in `MEMORY.md`. Gross revenue includes customer-paid product and shipping but excludes collected sales tax; subtract refunds conservatively. The target is met at USD 100.00 or more.

Use `npm run verify:revenue` (alias: `npm run revenue:verify`) for the live ledger probe. Never infer revenue when the protected Stripe key is unavailable.
