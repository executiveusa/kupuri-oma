FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json ./
COPY apps/mcp-host/package.json apps/mcp-host/package.json
COPY packages packages
RUN pnpm install --frozen-lockfile=false
COPY . .
RUN pnpm --filter @kupuri/mcp-host build
EXPOSE 3002
CMD ["pnpm","--filter","@kupuri/mcp-host","start"]
