FROM node:8.6.0-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# add npm package


RUN yarn


CMD yarn build