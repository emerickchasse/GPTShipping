# PawSwipe payment operations

Last reviewed: 2026-07-12

## Authoritative current state

- Gmail metadata confirms the connected owner has a Stripe account dating to 2021, Google sign-in was enabled in April 2026, and Stripe sent a product notification in June 2026.
- The owner completed authentication directly on July 12, 2026. The authenticated `SiteQC` account is accessible, operates in CAD, and has prior live payout evidence; Stripe's setup guide still shows email, business-information, and profile confirmation work, so live PawSwipe activation is not approved.
- A test secret and a test webhook signing secret are stored only in protected Render configuration. The active test webhook destination is `PawSwipe Render test checkout` at `https://pawswipe-checkout.onrender.com/api/stripe-webhook`, listening only for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
- Test keys accidentally exposed by Stripe's accessible page representation were immediately renewed with zero delay and were never deployed. Replacement values were transferred directly without repository or log persistence.
- A first private transfer extracted the full row rather than the copy control and appended the adjacent `Aucun` status to the token. Stripe correctly rejected it. The malformed value was replaced with the exact 107-character copy-control value; both the source and the protected Render value independently passed a harmless authenticated Stripe balance request before webhook retest.
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

The signed-event path deliberately does not require `LIVE_CHECKOUT_ENABLED` or Stripe Tax to be true. Those settings gate creation of a new Checkout Session; they do not gate authentication and recovery of a provider event that has already reached the server. Test-mode recovery still requires every configuration variable to exist, matching `livemode:false`, PawSwipe metadata, and unconfirmed Printful fulfillment.

Provider-backed webhook evidence on July 12, 2026: Stripe Shell triggered `checkout.session.completed`; endpoint delivery to Render returned HTTP 200 after the signed-event recovery fix. The Stripe fixture lacks PawSwipe metadata, so the server stopped before Printful. This proves signature validation, test-key retrieval, event parsing, and safe rejection—not a paid PawSwipe sandbox checkout or fulfillment draft.

Provider-backed checkout drill on July 12, 2026: a USD test Checkout Session displayed the size-M product at USD 24.99, standard tracked shipping at USD 4.49, and 9–11 business days before payment. Stripe's official test card completed the session with `livemode:false`, `payment_status:paid`, total USD 29.48, PawSwipe metadata, and a synthetic US recipient. The signed webhook created exactly one matching Printful `draft` with standard shipping and one item; auto-confirm and supplier billing remained false. This approves the customer-policy operating gate only. It is not live revenue, sample approval, supplier-billing approval, tax approval, or permission to open checkout.

## Evidence required before counting revenue

- live Stripe dashboard or API access;
- a paid PawSwipe Checkout Session with `livemode:true` and `metadata.store=pawswipe`;
- tax-exclusive product plus customer-shipping amount;
- refund state checked conservatively;
- redacted session/order identifier recorded in `MEMORY.md`;
- `npm run verify:revenue` independently reproduces the total.
