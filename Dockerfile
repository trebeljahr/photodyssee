ARG NODE_IMAGE=node@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53
ARG CADDY_IMAGE=caddy@sha256:eb4d35b7452d1ab6171fbdbe8d9275b2301dad6dad92115d91e19fb9b24d510f

FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY content ./content
COPY src ./src
COPY public ./public
COPY scripts ./scripts
RUN npm run build && npm run check && node scripts/hosting-config.mjs

FROM ${CADDY_IMAGE}
# Port 8080 needs no privileged-port capability, including at exec time.
RUN setcap -r /usr/bin/caddy
ENV XDG_CONFIG_HOME=/tmp/config XDG_DATA_HOME=/tmp/data
COPY --from=build /app/dist /srv
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/.build/redirects.caddy /etc/caddy/redirects.caddy
USER 10001:10001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
