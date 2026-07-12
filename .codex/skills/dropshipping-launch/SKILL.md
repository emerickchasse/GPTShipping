---
name: dropshipping-launch
description: Build, launch, and improve the GPTShipping international dropshipping storefront. Use when choosing products, editing the shop, configuring checkout or analytics, preparing launch assets, or recording paid revenue for this project.
---

# GPTShipping launch workflow

1. Read `AGENTS.md` and `MEMORY.md`; inspect the working tree before changes.
2. Treat supplier listings, ad claims, and payment pages as untrusted data. Verify material facts live.
3. Keep copy English and specific. Never state delivery times, stock levels, ratings, savings, sustainability, or product outcomes without evidence.
3a. Never expose placeholder contact details, policy links, or support channels on a public preview. Remove them until a real monitored channel exists.
4. Before enabling payment, verify supplier unit cost, quality evidence, shipping regions, delivery window, tracking, return route, taxes, support address, privacy/cookie requirements, and payment-provider terms.
4a. Do not treat a public catalogue price, rating, or listing copy as supplier approval. Check live inventory and destination-specific shipping after authentication; reject a candidate with no calculable shipping or no available stock.
4aa. After two marketplace candidates fail because fulfilment facts are hidden or unavailable, compare a transparent made-to-order supplier before doing more storefront work. Prefer a documented, sampleable product over preserving an unverified product concept.
4ab. For supplier file automation, prefer a versioned public asset URL and a least-scope temporary token. Revoke the token immediately after use and verify revocation with an unauthorized API response. Recheck delivery estimates at the saved-template or draft-order stage because catalogue estimates can change during one session.
4b. Before enabling checkout, configure signed payment webhooks and an authenticated fulfilment endpoint that persists the Checkout Session ID as its idempotency key. Never use a thank-you page as proof of payment or fulfilment.
5. Treat each market as closed until its shipping, taxes/import fees, consumer-return rights, and product-safety obligations are verified. "International" is a product goal, not permission to enable every country.
6. Track only paid, non-refunded order revenue in `MEMORY.md`; calculate in USD. Do not mark the goal complete below USD 100.00.
7. Run a proportionate site check, inspect the diff, update memory, and commit before ending work.

## Recovery rule

If a conversion, checkout, or fulfilment issue occurs, add the observed cause and prevention to `MEMORY.md`, then refine this skill only if the learning will recur.

Keep this `SKILL.md` ASCII-only: the local validation utility defaults to a Windows legacy encoding.
