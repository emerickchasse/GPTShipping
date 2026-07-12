# Supplier research ledger

Last reviewed: 2026-07-12

This ledger records supplier evidence without treating listing copy as verified product performance. A candidate is launch-ready only after its exact variant, destination-specific landed cost, stock or production availability, tracking, delivery estimate, return route, and automated fulfilment path are proven.

## Current decision

The generic reusable pet-hair remover is not approved. Public CJdropshipping candidates show unavailable or indeterminate inventory and no calculable shipping. Public Spocket candidates expose a supplier and product price but hide destination shipping, delivery, and return details behind the merchant account.

The preferred pivot candidate is Printful product code **655**, the All-Over Print Bandana. It is not approved for sale yet, but it has a substantially stronger evidence base and a free authenticated supplier environment is now available.

## Candidate evidence

| Candidate | Public evidence | Missing launch evidence | Decision |
| --- | --- | --- | --- |
| CJ `CJGY191933001AZ` | USD 8.26 listing price | Inventory is 0; no shipping method or delivery estimate | Rejected |
| CJ `CJMY210365701AZ` | USD 13.78 listing price; 30-day refund statement | Inventory is 0; no shipping method or delivery estimate | Rejected |
| Spocket Easy Pet Hair Remover Roller / Scarlet Coco | USD 14.99 supplier price and USD 24.99 suggested retail price | Exact variant, origin, destinations, shipping cost, delivery estimate, return route, and stock | Hold |
| Spocket 2-1 Reusable Pet Hair Remover / Maroon Asteria | USD 11.00 supplier price and USD 22.00 suggested retail price | Exact variant, origin, destinations, shipping cost, delivery estimate, return route, and stock | Hold |
| Printful All-Over Print Bandana / public code 655, API product 630 | Made on demand with no minimum; public materials, sizes, manufacturing locations, EU product contact, restricted destinations, and 2-5 business-day production estimate; S/M/L API variants currently in stock at USD 10.15; standard single-item US shipping USD 4.49; free supplier account and product template created | Destination-ZIP tax, sample quality, billing method, order automation, and customer-facing returns policy | Approved for sample validation only |

## Printful operating facts

- The free plan has no monthly fee; fulfilment is charged after an order.
- Product code 655 is made on demand in sizes S, M, and L. Printful warns that S is unsuitable for a grown adult and requires accurate sizing disclosure.
- Public regional listing evidence reports production in Mexico or Latvia and region-dependent polyester composition.
- Printful estimates 2-5 business days for production. Shipping time depends on destination and is not guaranteed.
- Printful excludes restricted destinations including Russia, Belarus, Cuba, Iran, Syria, and North Korea, plus several listed regions. Enabled storefront markets must be a verified subset, not “worldwide.”
- Manufacturing defects or damaged products may qualify for a free reprint or refund when reported with evidence within 30 days. Buyer remorse and wrong size/color are not covered by the supplier, so the store needs its own accurate consumer policy and sizing controls.
- Customs charges may apply when fulfilment occurs outside the destination region.
- The authenticated Canada product page quoted **C$14.50** base cost, shipping from **C$8.95**, and **13-16 days** estimated delivery on 2026-07-12. It also warned that customs charges may apply. These are supplier inputs, not a customer promise, and must be rechecked before launch.
- The final original pattern asset is `assets/printful/paw-pattern-v2.png` (1254x1254 RGB PNG). It contains no text or third-party marks. An 8-pixel opposite-edge comparison measured mean RGB differences below 1.2/255 on both axes, suitable for repetition in the AOP maker. The first generated draft failed this edge test and was discarded.
- Printful file `1014307040` processed the public PNG successfully. Product template `104922382`, **PawSwipe Pet Parade Bandana**, was saved for S/M/L with a regular repeat at 30% scale, black stitching, and Printful's **Good / 152 DPI** quality result.
- The saved template page displayed C$14.50 and an updated Canada delivery estimate of 17-19 days. Supplier estimates changed during the same session (the catalogue page earlier showed 13-16 days), proving that storefront delivery copy must be calculated and displayed dynamically or revalidated immediately before launch.
- The official legacy Catalog API maps the current bandana page to internal product `630`. On 2026-07-12, variants `16031`, `16032`, and `16033` (S/M/L) each reported `in_stock: true` and a fixed North American base price of **USD 10.15**. Printful's current shipping table places bandanas in all-over print clothing and textiles, with **USD 4.49** standard US shipping for one item and **USD 2.00** for each additional item. The one-item supplier subtotal is therefore **USD 14.64 before destination tax**.
- A working retail hypothesis is **USD 24.99 with US standard shipping included**. That leaves USD 10.35 (41.4%) before destination tax, payment fees, refunds, support, and marketing. It is an internal validation number, not an approved public price. Four sales would total USD 99.96 and would not meet the mission; five non-refunded sales would total USD 124.95.
- A store-scoped private token with only File Library write access was created to import the public asset URL, then revoked immediately. A post-revocation API request returned HTTP 401. No token was logged, committed, or retained.

## Next validation gate

1. Obtain a destination-ZIP checkout tax quote and recheck the USD base/shipping immediately before launch.
2. Order and inspect a sample before publishing performance or quality claims.
3. Configure authenticated order fulfilment only after payment, support, tax, and customer-policy gates are also satisfied.

## Primary sources

- [Printful product code 655](https://www.printful.com/custom/pet-products/personalized/all-over-print-bandana)
- [Printful shipping speeds and pricing](https://www.printful.com/shipping)
- [Printful pricing](https://www.printful.com/pricing)
- [Printful legacy Catalog API product 630](https://api.printful.com/products/630)
- [Printful refunds and returns](https://support.printful.com/hc/en-us/articles/41396595299729-How-does-Printful-handle-refunds-and-returns)
