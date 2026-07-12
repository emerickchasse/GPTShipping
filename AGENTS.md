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

## Launch gate

Before taking payment, configure a real payment provider, a verified product supplier, truthful shipping/returns pages, support contact, privacy/cookie notices where required, analytics consent handling, and a deployed HTTPS domain. Confirm the checkout from the buyer's perspective.

## Success evidence

Store a redacted record of paid order IDs, amount, currency, and payment date in `MEMORY.md`. Sum only paid, non-refunded orders. The target is met at USD 100.00 or more.
