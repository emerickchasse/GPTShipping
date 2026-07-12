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

## Verified revenue ledger

| Paid date | Order ID | USD gross | Refund status | Evidence |
| --- | --- | ---: | --- | --- |
| _None_ | — | 0.00 | — | No payments integration configured |

**Verified gross revenue: USD 0.00 / 100.00.**
