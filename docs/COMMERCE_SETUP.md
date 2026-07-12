# Commerce setup and proof of revenue

## What this integration does

`server.mjs` creates a Stripe-hosted Checkout Session only when the environment is complete and `LIVE_CHECKOUT_ENABLED=true`. The secret key remains server-side. Checkout collects billing and shipping addresses, calculates tax through Stripe Tax, records a store/SKU marker in Stripe metadata, and redirects to `thank-you.html` after payment.

After deployment, `GET /api/checkout-readiness` exposes only booleans and a missing-setting count. It never returns a secret, product value, country list, or business identifier. Use it to confirm that the host has received the expected environment configuration before the final buyer-path test.

The storefront has no live waitlist or checkout until configuration is complete. That is intentional: it must not claim to accept money or retain an email when it cannot do so.

## Required, verified configuration

1. Create and verify a legitimate Stripe business account and tax registrations applicable to the enabled markets.
2. Verify the supplier's exact product, landed unit cost, quality, stock, destination countries, transit times, tracking, return address, and fulfilment route.
3. Use only the supplier-verified product copy, SKU, price and shipping amount in the protected host environment. Do not commit them.
4. Deploy the server on an HTTPS host and set `PUBLIC_BASE_URL` to its final origin.
5. Configure Stripe Tax accurately. This server refuses live checkout if `STRIPE_AUTOMATIC_TAX_ENABLED` is not true.
6. Configure Stripe to deliver `checkout.session.completed` and `checkout.session.async_payment_succeeded` events to `POST /api/stripe-webhook`. Set `STRIPE_WEBHOOK_SECRET` from that endpoint.
7. Configure an HTTPS fulfilment endpoint plus `FULFILLMENT_WEBHOOK_BEARER_TOKEN`. The endpoint must accept the paid-order payload, authenticate the bearer token, and make the `Idempotency-Key` (the Checkout Session ID) durable so retries never create duplicate supplier orders.
8. The server retrieves the paid session directly from Stripe before forwarding fulfilment data. It returns a non-2xx response on failure so Stripe retries the event.
9. Publish accurate shipping, returns, privacy, support, import-fee and product-safety pages for every enabled market.
10. Perform a real customer-path test, then enable the checkout.

## Verify the goal

Run `npm run verify:revenue` in an environment with the live Stripe secret. It outputs only redacted order identifiers, amounts, dates and refunds for live USD Checkout Sessions tagged `store=pawswipe`. It exits with code 0 only at USD 100.00 or above after refunds; otherwise it exits 2. Copy only the redacted result into `MEMORY.md`.

## Sources

- [Stripe Checkout Sessions](https://docs.stripe.com/payments/checkout/how-checkout-works)
- [Stripe order fulfilment and webhook guidance](https://docs.stripe.com/checkout/fulfillment)
- [Shopify dropshipping compliance guidance](https://help.shopify.com/en/manual/compliance/legal/dropshipping)
