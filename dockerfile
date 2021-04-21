FROM node:alpine

WORKDIR /home/service

COPY package.json .

CMD yarn start:docker:dev
