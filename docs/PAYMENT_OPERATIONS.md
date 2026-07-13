# PawSwipe payment operations

Last reviewed: 2026-07-12

## Authoritative current state

- Gmail metadata confirms the connected owner has a Stripe account dating to 2021, Google sign-in was enabled in April 2026, and Stripe sent a product notification in June 2026.
- The owner completed authentication directly on July 12, 2026. The authenticated `SiteQC` account is accessible, operates in CAD, and has prior live payout evidence; Stripe's setup guide still shows email, business-information, and profile confirmation work, so live PawSwipe activation is not approved.
- A test secret and a test webhook signing secret are stored only in protected Render configuration. The active test webhook destination is `PawSwipe Render test checkout` at `https://pawswipe-checkout.onrender.com/api/stripe-webhook`, listening only for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
- Test keys accidentally exposed by Stripe's accessible page representation were immediately renewed with zero delay and were never deployed. Replacement values were transferred directly without repository or log persistence.
- Render is Blueprint-managed. Pre-launch `STRIPE_CHECKOUT_MODE` is therefore source-controlled as `test`; dashboard-only edits are not authoritative.
- `LIVE_CHECKOUT_ENABLED`, automatic tax, sample approval, supplier billing approval, and customer-policy approval remain false. Live revenue still cannot be queried with test credentials.

Email evidence proves that an account exists; it does not prove account activation, business verification, current tax registrations, dashboard access, API capability, or PawSwipe revenue.

## Safe activation sequence

1. Keep the authenticated account separate from secret handling. Never relay, request, store, log, or attempt to bypass an MFA or recovery code.
2. Complete and verify the legal business, representative, payout account, statement descriptor, support details, and enabled US market inside Stripe before live activation.
3. Stay in Stripe test mode until the product, sample, supplier billing, policies, tax handling, and support path are all approved.
4. Replace the temporary standard test secret with a PawSwipe-only restricted key after Stripe persists the custom policy; Checkout Sessions needs write access for creation and retrieval.
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
