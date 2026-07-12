# syntax=docker/dockerfile:1.25
# check=error=true

FROM node:24.16.0-alpine3.22 AS runtime

ENV NODE_ENV=production \
    PORT=8080

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node server.mjs app.js guide.js styles.css index.html care-guide.html thank-you.html robots.txt sitemap.xml ./
COPY --chown=node:node assets ./assets

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node --input-type=module -e "const response = await fetch('http://127.0.0.1:8080/api/checkout-readiness'); process.exit(response.ok ? 0 : 1)"

CMD ["node", "server.mjs"]
