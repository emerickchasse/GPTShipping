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

The protected Render environment now has a single-store Printful Orders token expiring 2028-07-11 plus the verified S/M/L references. Never copy the token into the repository or logs. `PRINTFUL_AUTO_CONFIRM` must remain false until merchant billing and the complete paid-order path are verified.

The protected pilot-market configuration is US-only with internal working values USD 24.99 unit price and USD 4.49 standard shipping. These values are configured behind the disabled checkout gate, not public launch claims. Readiness still requires the Stripe secret and signed webhook plus the independent tax, billing, sample, and support approvals.

GitHub Pages must talk to Render only through the exact configured `PUBLIC_STOREFRONT_ORIGIN`. The public price and checkout button may switch from pending/disabled only after Render returns `ready:true`; CORS reachability or a reduced missing-settings count is never sufficient.

## Success evidence

Store a redacted record of paid order IDs, amount, currency, and payment date in `MEMORY.md`. Sum only paid, non-refunded orders. The target is met at USD 100.00 or more.
