# PawSwipe payment operations

Last reviewed: 2026-07-12

## Authoritative current state

- Gmail metadata confirms the connected owner has a Stripe account dating to 2021, Google sign-in was enabled in April 2026, and Stripe sent a product notification in June 2026.
- Google sign-in reaches the existing Stripe account but then requires a six-digit SMS code sent to the configured phone ending in 3905.
- Stripe exposes no configured alternative factor; the only other path is account recovery.
- No MFA code, API key, webhook secret, recovery data, payment, customer record, or dashboard access was obtained.
- Render therefore has no `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET`. Checkout remains disabled and live revenue cannot be queried.

Email evidence proves that an account exists; it does not prove account activation, business verification, current tax registrations, dashboard access, API capability, or PawSwipe revenue.

## Safe activation sequence

1. The account owner completes Stripe authentication directly. Never relay, request, store, log, or attempt to bypass an MFA or recovery code.
2. Verify the legal business, representative, payout account, statement descriptor, support details, and enabled US market inside Stripe.
3. Stay in Stripe Sandbox until the product, sample, supplier billing, policies, tax handling, and support path are all approved.
4. Create a restricted test secret and webhook endpoint for `https://pawswipe-checkout.onrender.com/api/stripe-webhook`.
5. Send `checkout.session.completed` and `checkout.session.async_payment_succeeded`, record the signing secret directly in protected Render configuration, and run a paid-sandbox end-to-end test.
6. Confirm that sandbox sessions remain `livemode:false`, create only idempotent Printful drafts, and never enter the live revenue ledger.
7. Configure and verify applicable Stripe Tax registrations before setting `STRIPE_AUTOMATIC_TAX_ENABLED=true`.
8. Only after every human gate is evidenced, install live credentials directly in protected configuration, verify `livemode:true`, and then evaluate `LIVE_CHECKOUT_ENABLED=true`.

## Evidence required before counting revenue

- live Stripe dashboard or API access;
- a paid PawSwipe Checkout Session with `livemode:true` and `metadata.store=pawswipe`;
- tax-exclusive product plus customer-shipping amount;
- refund state checked conservatively;
- redacted session/order identifier recorded in `MEMORY.md`;
- `npm run verify:revenue` independently reproduces the total.

