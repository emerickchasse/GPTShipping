# PawSwipe Pet Parade storefront

An English-language, responsive storefront preparing the original PawSwipe Pet Parade made-to-order pet bandana for a verified launch.

[![Digital preview of the PawSwipe Pet Parade cat-and-dog print on a bandana](https://emerickchasse.github.io/GPTShipping/assets/printful/pet-parade-digital-mockup-v1.jpg)](https://emerickchasse.github.io/GPTShipping/)

Digital preview only — the physical sample is still awaiting inspection and orders are not open.

## Start with a pet bandana question

- [Visit the PawSwipe Pet Parade preview](https://emerickchasse.github.io/GPTShipping/?utm_source=github)
- [Compare the verified S, M, and L bandana size chart](https://emerickchasse.github.io/GPTShipping/bandana-size-guide.html)
- [Measure a pet by comparing a comfortable square](https://emerickchasse.github.io/GPTShipping/measure-pet-for-bandana.html)
- [Learn how to tie a square dog bandana](https://emerickchasse.github.io/GPTShipping/how-to-tie-dog-bandana.html)
- [Compare tie-on and over-collar constructions](https://emerickchasse.github.io/GPTShipping/tie-on-vs-over-collar-dog-bandana.html)
- [Review size and supervised accessory use for cats](https://emerickchasse.github.io/GPTShipping/cat-bandana-guide.html)
- [Compare dog bandana material, weight, construction, and region](https://emerickchasse.github.io/GPTShipping/dog-bandana-material-guide.html)
- [Follow the email-free Atom guide feed](https://emerickchasse.github.io/GPTShipping/feed.xml)

Public feedback on guide clarity and missing decision questions belongs in [PawSwipe Discussion #4](https://github.com/emerickchasse/GPTShipping/discussions/4). GitHub posts are public and require an account; never post personal, address, payment, order, credential, identification, or private support information there.

Material comparison Q&A: [What dog bandana material facts do you compare?](https://github.com/emerickchasse/GPTShipping/discussions/5). The thread links the sourced material guide and keeps orders explicitly closed.

## Run locally

Run the built-in server, which keeps payment credentials server-side:

```powershell
npm start
```

Then open `http://localhost:8080`. Copy `.env.example` to a non-committed environment file only for local configuration; production secrets belong in the deployment host's encrypted settings.

## Launch status

This is intentionally a pre-launch prototype. The cart works locally and the server can create a Stripe-hosted Checkout Session only after every required protected environment setting is verified. See [docs/COMMERCE_SETUP.md](docs/COMMERCE_SETUP.md) and [MEMORY.md](MEMORY.md) for the live launch gate and verified revenue ledger. Do not enable payment until supplier, fulfilment, customer support, legal policies, and payment-provider configuration have been verified.

## Public preview

The GitHub Pages workflow publishes a static pre-launch preview only. It cannot collect payments or customer email addresses; use an HTTPS host running `server.mjs` for the real checkout after the launch gate has been met.

Current preview: [https://emerickchasse.github.io/GPTShipping/](https://emerickchasse.github.io/GPTShipping/?utm_source=github)

Search discovery and indexing evidence is tracked separately in [docs/ACQUISITION.md](docs/ACQUISITION.md); submitted URLs are never reported as indexed until Google confirms them.

## Container service

For a real HTTPS checkout host, see [docs/CONTAINER_DEPLOYMENT.md](docs/CONTAINER_DEPLOYMENT.md). The GitHub Pages preview does not run the container or accept payments.

The repository includes a `render.yaml` Blueprint for a free, non-production HTTPS validation service. It deliberately keeps checkout disabled and does not include commerce secrets. Render's free service can sleep after 15 minutes idle and is suitable for launch-readiness validation, not production checkout traffic.

Current validation service: [https://pawswipe-checkout.onrender.com](https://pawswipe-checkout.onrender.com). Its `/api/checkout-readiness` response must report `ready: true` before it can be considered commerce-ready; a rendered page or HTTP 200 is not enough.
