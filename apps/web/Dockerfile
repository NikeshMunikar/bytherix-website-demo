ARG NODE_VERSION=22.23-alpine3.23

FROM node:${NODE_VERSION} AS base

ENV COREPACK_HOME=/tmp/corepack

RUN corepack disable && \
    corepack enable yarn && \
    corepack prepare yarn@1.22.22 --activate && \
    yarn config set network-timeout 1800000

RUN addgroup --system --gid 1001 bytherix \
 && adduser --system --uid 1001 --ingroup bytherix --home /home/nextjs nextjs \
 && mkdir -p /home/nextjs \
 && chown -R nextjs:bytherix /home/nextjs

WORKDIR /app

FROM base AS deps

COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

RUN yarn install --frozen-lockfile

ENV PATH=/app/node_modules/.bin:$PATH

FROM deps AS builder

COPY apps/web/ ./apps/web/
COPY packages/shared/ ./packages/shared/

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN yarn workspace @bytherix/web build

FROM deps AS development

COPY apps/web/ ./apps/web/

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH

RUN mkdir -p /app/apps/web/.next && chown -R nextjs:bytherix /app/apps/web/.next

USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "cd /app/apps/web && next dev"]

FROM node:${NODE_VERSION} AS runner

RUN apk add --no-cache dumb-init wget \
 && addgroup --system --gid 1001 bytherix \
 && adduser --system --uid 1001 --ingroup bytherix --home /home/nextjs nextjs \
 && mkdir -p /home/nextjs \
 && chown -R nextjs:bytherix /home/nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV HOME=/home/nextjs
ENV COREPACK_HOME=/tmp/corepack

COPY --from=builder --chown=nextjs:bytherix /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:bytherix /app/apps/web/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:bytherix /app/apps/web/public           ./public

USER nextjs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]