# PawSwipe privacy data map

Last reviewed: July 12, 2026. Scope: US pilot, pre-launch configuration.

This document maps the fields in the current storefront, checkout server, Stripe Checkout handoff, Printful fulfillment request, and private support route. It is an implementation contract, not a claim that checkout is open.

| Stage | Data | Purpose and recipient | PawSwipe retention |
| --- | --- | --- | --- |
| Public storefront | Ordinary web request data such as IP address, path, user agent, and timestamp may reach GitHub Pages or Render. PawSwipe has no accounts, first-party analytics, ad pixels, or marketing cookies. | Deliver and secure the site. GitHub Pages and Render operate the hosting infrastructure. | PawSwipe does not create a customer profile from these requests. Render Hobby runtime logs are available for 7 days under Render's current plan policy; infrastructure providers apply their own policies. |
| Launch notification | Validated email address and required consent. | Send one email when Pet Parade ordering opens for eligible US destinations. Google Forms hosts intake; no newsletter, promotion, profiling, advertising audience, or tracking pixel use. | Delete within 30 days after the notice, earlier on verified request, or by July 12, 2027 if ordering has not opened and consent was not renewed. |
| Private support | Help category, reply email, optional PawSwipe order reference, message, and privacy confirmation. | Review, route, answer, and document a request. Google Forms and Gmail host the private intake and queue. | Delete routine support records 24 months after the last activity. Keep a record longer only when needed for an unresolved dispute, fraud/security review, legal requirement, or a transaction record subject to the six-year schedule below. |
| Stripe Checkout | Billing address, shipping address, phone number, email/customer details, payment and transaction data, tax and fraud signals; order metadata limited to store, SKU, size, and an allowlisted attribution source. PawSwipe's server never receives a full card number or card security code. | Create and secure payment, calculate tax, issue refunds, and retrieve a paid session. Stripe processes payment data and may act as processor or independent controller for its documented activities. | PawSwipe retains the transaction record for six years from the end of the last tax year it relates to. Stripe applies its own category- and purpose-specific retention obligations described in its Privacy Center. |
| Printful fulfillment | Customer name, email, phone, shipping address (line 1, optional line 2, city, state, country, postal code), hashed external order ID, selected variant/size, quantity, and retail unit price. | Produce, ship, track, cancel where possible, and resolve fulfillment claims. Printful receives only after a qualifying paid Stripe event. | PawSwipe retains the transaction/fulfillment record for six years from the end of the last tax year it relates to. Printful retains data while necessary for its account, contract, tax, dispute, fraud, and legal obligations under its Privacy Policy. |

## Choices and request handling

- Before launch, browsing requires no account and the support form is optional.
- A buyer can avoid checkout data collection by not starting or completing checkout.
- A customer may use the private support form to request access, correction, or deletion of PawSwipe-controlled data. Identity and order ownership must be verified without asking for card details, passwords, one-time codes, or government ID through the form.
- PawSwipe will delete or correct data it controls when the request is verified and no transaction, dispute, fraud/security, or legal retention duty requires continued storage. Processor-specific requests may need to be forwarded to Stripe, Printful, Google, GitHub, or Render.
- PawSwipe does not sell customer data and does not use the mapped data for advertising.

## Retention authority and review triggers

The Canada Revenue Agency requires business records and supporting documents to be kept for six years from the end of the last tax year they relate to, unless early destruction is authorized. Provider retention is not presented as a fixed PawSwipe-controlled period where the provider publishes a purpose-based rule instead.

Review this map before enabling a new market, analytics, advertising, email capture, another payment method, another fulfillment provider, or any checkout-field change.

## Official sources

- [Canada Revenue Agency — keeping records](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc188/keeping-records.html)
- [Stripe Privacy Center](https://stripe.com/legal/privacy-center)
- [Printful Privacy Policy](https://www.printful.com/policies/privacy)
- [Render logging and plan retention](https://render.com/docs/logging)
