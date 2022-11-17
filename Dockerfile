FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN yarn install

COPY . .

EXPOSE 3001

CMD [ "yarn", "start" ]

