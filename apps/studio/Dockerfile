FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json ./
COPY apps/studio/package.json apps/studio/package.json
COPY packages packages
RUN pnpm install --frozen-lockfile=false
COPY . .
RUN pnpm --filter @kupuri/studio build
EXPOSE 3001
CMD ["pnpm","--filter","@kupuri/studio","start"]
