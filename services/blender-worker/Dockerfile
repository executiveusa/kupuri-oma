FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache blender
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY services/blender-worker/package.json services/blender-worker/package.json
COPY packages/shared-config packages/shared-config
RUN pnpm install --frozen-lockfile=false
COPY services/blender-worker services/blender-worker
EXPOSE 8080
CMD ["pnpm","--filter","@kupuri/blender-worker","start"]
