# frontend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app

# yarn を有効化（Node同梱の corepack）
RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

COPY --from=builder /app ./
EXPOSE 3000
CMD ["yarn", "start"]
