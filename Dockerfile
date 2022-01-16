FROM denoland/deno:centos

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

EXPOSE 8080
EXPOSE 8888
EXPOSE 3000
