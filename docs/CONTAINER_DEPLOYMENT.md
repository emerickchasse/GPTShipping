# Container deployment

Build the real checkout service as a container only after the commerce launch gate is met.

```powershell
docker buildx build --load --tag pawswipe:local .
docker run --rm --env-file .env -p 127.0.0.1:8080:8080 pawswipe:local
```

The container runs as the non-root `node` user and exposes only port 8080. Its health check calls `/api/checkout-readiness`; a healthy container is not proof that checkout is ready to sell.

For production, use an HTTPS platform that injects the protected environment values from `.env.example`, terminates TLS, and routes the Stripe webhook to `/api/stripe-webhook`. Do not publish `.env`, supplier credentials, webhook secrets, order data, or Stripe keys in an image, image registry, GitHub Pages, or GitHub Actions logs.

Before exposing the service publicly, confirm that `GET /api/checkout-readiness` reports `ready: true` with real configuration and complete the buyer-path and fulfilment tests.
