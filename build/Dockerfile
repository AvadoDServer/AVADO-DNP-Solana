FROM node:16.13.1 as builder

# build wizard
WORKDIR /usr/src/app/wizard
COPY wizard .
RUN yarn
RUN rm -Rf build && yarn run build

FROM alpine:latest
ARG VERSION
ENV SOLANA_VERSION=${VERSION}

RUN apk add supervisor nginx nodejs npm docker bash

#Copy wizard
COPY --from=builder /usr/src/app/wizard/build /usr/local/wizard

# Monitor
WORKDIR /usr/src/monitor
COPY monitor .
RUN npm i --production

# Other files
COPY supervisord.conf /etc/supervisord.conf
COPY installSolanaDocker.sh /root/
COPY installSolanaHost.sh /root/
RUN chmod +x "/root/installSolanaDocker.sh"
RUN chmod +x "/root/installSolanaHost.sh"
RUN echo ${VERSION} > /root/SOLANA_VERSION
COPY nginx.conf /etc/nginx/

WORKDIR /
ENTRYPOINT ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord.conf"]


