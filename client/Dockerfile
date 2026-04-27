# Vite production Docker image file
FROM node:lts-alpine as build
WORKDIR /service
RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM caddy:alpine
COPY --from=build /service/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
