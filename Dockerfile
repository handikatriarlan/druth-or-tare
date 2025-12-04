# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.3.2
FROM oven/bun:${BUN_VERSION}-slim AS base

LABEL fly_launch_runtime="Bun"

WORKDIR /app

ENV NODE_ENV="production"

COPY bun.lock package.json ./
RUN bun install --ci

COPY . .

EXPOSE 3000

CMD [ "bun", "run", "index.js" ]
