FROM node:16.13.1 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build

FROM alpine:latest

RUN apk add supervisor nginx nodejs npm

COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf /etc/nginx/


# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN npm i --production

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


