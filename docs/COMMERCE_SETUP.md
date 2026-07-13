# Commerce setup and proof of revenue

## What this integration does

`server.mjs` creates a Stripe-hosted Checkout Session only when the environment is complete and `LIVE_CHECKOUT_ENABLED=true`. The secret key remains server-side. Checkout collects billing and shipping addresses plus a fulfilment phone number, calculates tax through Stripe Tax, records store/SKU/size markers in Stripe metadata, and redirects to `thank-you.html` after payment.

`STRIPE_CHECKOUT_MODE` must be explicitly `test` or `live`. Webhook fulfilment accepts only sessions whose Stripe `livemode` flag matches that setting. Test sessions can exercise sandbox fulfilment, but `verify:revenue` continues to count live paid sessions only.

Browser checkout requests must carry either the exact `PUBLIC_STOREFRONT_ORIGIN` or the API service's own origin. Foreign, missing, or malformed origins receive HTTP 403 before the request body is parsed or Stripe is called. This is separate from the signed Stripe webhook, which does not depend on browser Origin headers.

After deployment, `GET /api/checkout-readiness` exposes only booleans and a missing-setting count. It never returns a secret, product value, country list, or business identifier. Use it to confirm that the host has received the expected environment configuration before the final buyer-path test.

The storefront has no live waitlist or checkout until configuration is complete. That is intentional: it must not claim to accept money or retain an email when it cannot do so.

## Required, verified configuration

1. Create and verify a legitimate Stripe business account and tax registrations applicable to the enabled markets.
   A non-activated Stripe account can be used for Sandbox work; never copy test keys into a live-mode host or count sandbox payments as revenue.
2. Verify the supplier's exact product, landed unit cost, quality, stock, destination countries, transit times, tracking, return address, and fulfilment route.
3. Use only the supplier-verified product copy, SKU, price and shipping amount in the protected host environment. Do not commit them.
4. Deploy the server on an HTTPS host and set `PUBLIC_BASE_URL` to its final origin.
5. Configure Stripe Tax accurately. Set `PAWSWIPE_PRODUCT_TAX_CODE` to an explicitly verified Stripe product tax code; the US pilot currently uses `txcd_99999999` (General - Tangible Goods) so its physical bandana can never inherit the connected SiteQC account's unrelated SaaS default. This server refuses live checkout if the code is absent/malformed or `STRIPE_AUTOMATIC_TAX_ENABLED` is not true. A product code and automatic calculation do not prove registrations or remittance readiness.
6. Configure Stripe to deliver `checkout.session.completed` and `checkout.session.async_payment_succeeded` events to `POST /api/stripe-webhook`. Set `STRIPE_WEBHOOK_SECRET` from that endpoint.
7. Create a store-scoped Printful token with the minimum Orders permission and set `PRINTFUL_API_TOKEN`, `PRINTFUL_STORE_ID`, and the three verified external variant references. Never commit or log the token.
8. The server retrieves the paid session directly from Stripe, hashes the long Checkout Session ID into a stable Printful-compatible external order ID, and uses `update_existing=true` so webhook retries update rather than duplicate an order.
9. Keep `PRINTFUL_AUTO_CONFIRM=false` while testing: this creates a draft and does not submit it for fulfilment. Set it to `true` only after the merchant billing method, sample, address mapping, and buyer-path test are verified; Printful charges the merchant when an order is confirmed.
10. Publish accurate shipping, returns, privacy, support, import-fee and product-safety pages for every enabled market.
11. Perform a real customer-path test for every offered size, then enable the checkout.

## Verify the goal

Run `npm run verify:revenue` in an environment with the live Stripe secret. It outputs only redacted order identifiers, amounts, dates and refunds for live USD Checkout Sessions tagged `store=pawswipe`. It exits with code 0 only at USD 100.00 or above after refunds; otherwise it exits 2. Copy only the redacted result into `MEMORY.md`.

## Sources

- [Stripe Checkout Sessions](https://docs.stripe.com/payments/checkout/how-checkout-works)
- [Stripe order fulfilment and webhook guidance](https://docs.stripe.com/checkout/fulfillment)
- [Printful Orders API](https://developers.printful.com/docs/#tag/Orders-API)
- [Shopify dropshipping compliance guidance](https://help.shopify.com/en/manual/compliance/legal/dropshipping)
