# PawSwipe order-remedy drill

Last reviewed: July 12, 2026.

Run privately from the repository:

```text
npm run drill:remedy -- <private-case.json>
```

The input joins a protected Stripe Checkout Session, its corresponding Printful order, and one issue. The tool derives the same hashed Printful external order ID used by fulfillment and stops on a mismatch or unpaid session. Its output contains only a 12-character session fingerprint, hashed Printful reference, issue kind, correlation/payment booleans, policy eligibility, and the next manual action.

It never outputs the raw Stripe Session ID, customer name, email, phone, shipping address, card data, message body, photographs, or provider payloads. Keep the input outside Git and delete it after the case record is stored in the approved private system.

## Supported routes

- `defect`: checks the 30-day delivery window and requests minimum photographs before review.
- `transit_loss`: checks the 30-day estimated-delivery window and requires tracking review before replacement/refund review.
- `delay`: after an unshipped promise is missed, routes to express delay consent or a full-refund choice.
- `cancellation`: attempts supplier cancellation only while the supplier status is still draft, pending, or on hold.

No route automatically refunds, cancels, replaces, contacts a customer, or changes provider state. A trained operator must verify current Stripe and Printful records and applicable law before acting.

## Synthetic evidence

`test/fixtures/remedy-delay.json` intentionally includes fake email, phone, address, and raw session fields. The complete CLI drill correlated the derived payment/fulfillment reference and returned `offer_delay_consent_or_full_refund`; an executable check confirmed that none of those raw/private values appeared in output. The test suite also covers mismatches, defects with/without photos, transit-loss windows, delay, and cancellation.

This proves deterministic redaction and routing against synthetic records. A later non-chargeable provider-backed drill also proved retrieval of one paid Stripe test session, its matching Printful draft, the visible 9–11-business-day shipping disclosure, and privacy-safe operator correlation. That evidence approved `PAWSWIPE_CUSTOMER_POLICIES_APPROVED=true`; it is not evidence of an issued refund, replacement, cancellation, delivered order, or customer outcome.
