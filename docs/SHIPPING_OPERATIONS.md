# PawSwipe US shipping operations

Last verified: July 12, 2026. Product: Printful All-Over Print Bandana, product code 655, PawSwipe sync product 445876313.

## Current evidence

The authenticated Printful product catalogue was set to the United States selling region and reloaded. It displayed an estimated delivery window of **9-11 business days to the United States** and stated that delivery estimates are approximate and can vary. The same 9-11-business-day window appeared after selecting S, M, and L. This is current planning evidence, not a guarantee or evidence of an actual delivered order.

Stripe's current Checkout Sessions API supports a displayable `shipping_options.shipping_rate_data.delivery_estimate` with minimum and maximum values in `business_day` units. PawSwipe maps the supplier-supported range into that Stripe field so the buyer sees it before payment.

## Launch and ongoing checks

1. Before enabling `PAWSWIPE_CUSTOMER_POLICIES_APPROVED`, recheck the authenticated Printful product page for the United States on all three variants. Record the date and range here.
2. Keep `PAWSWIPE_DELIVERY_MIN_BUSINESS_DAYS` and `PAWSWIPE_DELIVERY_MAX_BUSINESS_DAYS` equal to the current supported range. Never shorten or convert business days to calendar days.
3. Confirm a Stripe test Checkout Session displays the exact range beside the shipping option before payment. A request payload or unit test alone is not visual checkout evidence.
4. After a paid order, retain the Stripe Session ID, Printful external order ID, production status, tracking URL, carrier, estimated delivery date, and delivery/claim outcome in the private order record.
5. Send tracking when available. If the estimate changes or the order cannot ship as promised, offer delay consent or cancellation with a full refund according to the public policy.
6. Review the supplier range at least weekly while checkout is live and immediately after any variant, fulfillment-region, or carrier change. If the supported range changes, close checkout until Stripe and the public policy match.

## Remedy drill still required

Private support intake and acknowledgement are proven. The synthetic `npm run drill:remedy` path now proves hashed reference correlation, privacy-safe output, and deterministic defect/loss/delay/cancellation routing. Customer-policy approval remains false until a non-chargeable provider-backed test proves the operator can retrieve matching Stripe and Printful test records, visibly confirm the Stripe delivery range, and record a simulated refund/replacement decision without exposing customer or payment data.

## Official sources

- [Stripe Checkout Session creation parameters](https://docs.stripe.com/api/checkout/sessions/create)
- [Printful: how estimated delivery time is calculated](https://help.printful.com/hc/en-us/articles/360014066779-How-is-the-estimated-delivery-time-calculated)
- [FTC Mail, Internet, or Telephone Order Merchandise Rule guide](https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule)
