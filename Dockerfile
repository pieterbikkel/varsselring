# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output .output
COPY package.json package.json
COPY nuxt.config.ts nuxt.config.ts
COPY public public
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
