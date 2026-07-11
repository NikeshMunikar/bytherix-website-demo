ARG NODE_VERSION=22.23-alpine3.23

FROM node:${NODE_VERSION} AS base

ENV COREPACK_HOME=/tmp/corepack

RUN corepack disable && \
    corepack enable yarn && \
    corepack prepare yarn@1.22.22 --activate && \
    yarn config set network-timeout 1800000

RUN addgroup --system --gid 1001 bytherix \
 && adduser \
      --system \
      --uid 1001 \
      --ingroup bytherix \
      --home /home/apiuser \
      apiuser \
 && mkdir -p /home/apiuser \
 && chown -R apiuser:bytherix /home/apiuser

WORKDIR /app

FROM base AS deps

COPY package.json yarn.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

RUN yarn install --frozen-lockfile

ENV PATH=/app/node_modules/.bin:$PATH

FROM deps AS builder

COPY apps/api/ ./apps/api/
COPY packages/shared/ ./packages/shared/

RUN yarn workspace @bytherix/api build

FROM base AS prod-deps

COPY package.json yarn.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

RUN yarn install --frozen-lockfile --production

FROM deps AS development

COPY apps/api/ ./apps/api/
COPY packages/shared/ ./packages/shared/

ENV PATH=/app/node_modules/.bin:$PATH

RUN mkdir -p /home/apiuser && chown -R apiuser:bytherix /home/apiuser

USER apiuser
EXPOSE 5000
CMD ["tsx", "watch", "apps/api/src/server.ts"]

FROM node:${NODE_VERSION} AS runner

RUN apk add --no-cache dumb-init wget \
 && addgroup --system --gid 1001 bytherix \
 && adduser \
      --system \
      --uid 1001 \
      --ingroup bytherix \
      --home /home/apiuser \
      apiuser \
 && mkdir -p /home/apiuser \
 && chown -R apiuser:bytherix /home/apiuser

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV HOME=/home/apiuser
ENV COREPACK_HOME=/tmp/corepack

COPY --from=builder   --chown=apiuser:bytherix /app/apps/api/dist         ./dist
COPY --from=prod-deps --chown=apiuser:bytherix /app/node_modules          ./node_modules
COPY --from=builder   --chown=apiuser:bytherix /app/apps/api/package.json ./

ENV PATH=/app/node_modules/.bin:$PATH

USER apiuser
EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]