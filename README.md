# PawSwipe storefront prototype

An English-language, responsive storefront for the PawSwipe pet-hair-remover concept.

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

Current preview: [https://emerickchasse.github.io/GPTShipping/](https://emerickchasse.github.io/GPTShipping/)

## Container service

For a real HTTPS checkout host, see [docs/CONTAINER_DEPLOYMENT.md](docs/CONTAINER_DEPLOYMENT.md). The GitHub Pages preview does not run the container or accept payments.
