# Project Memory — GPTShipping

## Current objective

Launch an English-language international dropshipping store and record verified gross revenue of at least **USD 100.00**. This is not achieved yet.

## 2026-07-12 — baseline

- Repository began empty.
- Product direction selected for the initial storefront: **PawSwipe**, a reusable pet-hair remover for clothing and furniture. It avoids battery/shipping hazards and medical claims, but supplier quality, fulfilment regions, price, and availability remain unverified.
- The initial site is a conversion-focused storefront prototype, not a live checkout. No supplier, payment processor, domain, or deployment has been configured. No revenue exists.
- Launch gate: obtain verified supplier economics and policies; configure payment provider; replace placeholder checkout; deploy HTTPS; test checkout; add legally accurate policies and support details; track paid orders.
- Local storefront QA passed in Chrome at `http://127.0.0.1:8080`: desktop layout rendered, a selected quantity of two updated the cart to `$48.00 USD`, and the cart disclosed that checkout is not live. JavaScript syntax check and skill validation passed.
- Supplier and payment provider remain the real launch blockers. Official Shopify guidance reviewed on 2026-07-12 confirms that the merchant remains responsible for product safety, accurate processing/shipping and import-cost disclosures, refunds, and market-specific legal compliance. Do not interpret “international” as “all countries”: enable only individually verified markets after supplier, tax, returns, and delivery evidence exist.
- Project-skill lesson: keep `.codex/skills/dropshipping-launch/SKILL.md` ASCII-only because the local skill validator currently reads it using a legacy Windows encoding.
- 2026-07-12: no local commerce/deployment credentials or existing Chrome merchant account were available. A server-side Stripe Checkout integration, a protected configuration template, a success page, and a refund-aware revenue verifier are now being added; live checkout remains disabled by configuration.
- Supplier research on 2026-07-12: CJdropshipping SKU `CJGY191933001AZ` appeared relevant at USD 8.26 but is disqualified for launch evidence because the public page reported inventory 0 and no shipping method/delivery estimate. Spocket pages show potential reusable lint-remover candidates, but their supplier, destination-specific shipping, returns, and actual availability still need authenticated verification. No supplier has been approved.
- Blocked 2026-07-12 after three consecutive goal work cycles on the same external dependency: no verified supplier account, payment merchant account, deployment account, protected credentials, support identity, or legal/fulfilment data is available. The Chrome session has no commerce account open. The app intentionally refuses checkout without these inputs. Resume only with externally verified business and fulfilment state; do not change the revenue ledger until paid Stripe evidence exists.
- Resumed 2026-07-12: add a non-sensitive checkout-readiness endpoint so a future deployment can prove that its environment is complete without exposing any secret or supplier/customer data.
- Resumed 2026-07-12: add a signed Stripe webhook that retrieves the authoritative paid session and forwards it to an authenticated supplier fulfilment endpoint using the Checkout Session ID as an idempotency key. Checkout readiness now requires webhook and fulfilment configuration too.
- Webhook QA passed with local non-production placeholder configuration: a correctly signed non-payment Stripe event returned 200 without any external call; an invalid signature returned 400. Syntax checks and skill validation passed. This does not verify a live payment, supplier fulfilment, or revenue.
- Blocked again on 2026-07-12 after the resumed three-cycle audit: the local environment still has no commerce credentials and no external commerce account, supplier evidence, deploy target, support identity, or legal/fulfilment data has become available. The technical checkout, readiness, webhook, and revenue-verification paths cannot turn this into a sale without those external facts and accounts.
- 2026-07-12: a GitHub account is authenticated. Add a least-privilege GitHub Pages workflow that publishes only the static pre-launch preview; it must never be mistaken for the HTTPS server that handles real checkout and webhooks.
- GitHub Pages deployment attempt: the build succeeded, but the protected `github-pages` environment allows only branch `main`; the repository began on `master`. Align the local branch and workflow trigger to `main` instead of weakening the environment policy.
- GitHub Pages deployment succeeded from `main` on 2026-07-12. The public pre-launch preview is `https://emerickchasse.github.io/GPTShipping/`; Chrome QA confirmed it renders and reports "This preview does not accept payments." after checkout is selected. It is not a live commerce deployment and contributes no revenue.
- 2026-07-12: add a non-root Node 24 container for `server.mjs`. It is buildable locally and can be handed to an HTTPS container host later; GitHub Pages remains static-only.
- Container QA passed on 2026-07-12: `docker buildx build --check` reported no warnings, the `pawswipe:local` image built successfully, and a container ran as `node` with the protected readiness endpoint reporting 11 missing live-commerce settings. No credentials or payment data were used.
- 2026-07-12: add a GitHub Actions workflow that publishes a Linux/amd64 checkout container to GitHub Container Registry with an immutable commit-SHA tag and `latest` alias. It receives only package-write permission and no commerce secrets.
- GHCR publication passed on 2026-07-12: `ghcr.io/emerickchasse/gptshipping:2c5ab4d003a6113a0e754bb3031831cb9b5d94aa` pulled publicly with digest `sha256:35040ce619c21a7e6b2e15bcacbdbb3d19b8db1c236461712410320631b2b9f3` and served the protected readiness endpoint in a local container. This is deployable infrastructure, not sales evidence.
- 2026-07-12: no GitHub Actions secrets or variables exist for this repository. Add a read-only CI workflow that checks Node syntax and Dockerfile BuildKit rules before preview or container publications.
- Stripe availability check on 2026-07-12: Chrome reached the Stripe dashboard login screen; no existing authenticated Stripe session is available. No credentials were entered, no account was created, and no payment configuration changed.

## Verified revenue ledger

| Paid date | Order ID | USD gross | Refund status | Evidence |
| --- | --- | ---: | --- | --- |
| _None_ | — | 0.00 | — | No payments integration configured |

**Verified gross revenue: USD 0.00 / 100.00.**
