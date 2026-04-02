
ARG IMAGE_PREFIX
ARG NODE_IMAGE=node:20
ARG NGINX_IMAGE=nginx:alpine
FROM ${IMAGE_PREFIX}${NODE_IMAGE} as builder

ARG SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_URL
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG API_URL
ARG CI_COMMIT_REF_SLUG
ARG CI_COMMIT_SHORT_SHA
ARG NPM_TOKEN

WORKDIR /code
ADD package.json .
ADD yarn.lock .

# Копируем локальные пакеты (.tgz, локальные библиотеки),
# иначе Yarn не найдёт file: <ссылки>
COPY libs/ ./libs/

RUN yarn install

ADD . .

RUN yarn build

FROM ${IMAGE_PREFIX}${NGINX_IMAGE} as final
COPY --from=builder /code/public/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-scripts/ /docker-entrypoint.d/
EXPOSE 80 80
