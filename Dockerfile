FROM node:20-alpine

WORKDIR /app

# 基础依赖：pnpm + bash（用于容器启动脚本）
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate \
  && apk add --no-cache bash

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/client/package.json ./packages/client/package.json
COPY packages/server/package.json ./packages/server/package.json

RUN pnpm install --frozen-lockfile=false

COPY . .

EXPOSE 3000 5173

CMD ["pnpm", "dev:all"]
