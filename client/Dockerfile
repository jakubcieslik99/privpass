# Vite production Docker image file
FROM node:lts-alpine
WORKDIR /service
RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml .
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
CMD ["pnpm", "run", "preview"]
