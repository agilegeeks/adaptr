FROM node:16-alpine3.11

RUN apk update && apk add bash git yarn
RUN mkdir -p /src/adaptr

WORKDIR /src/adaptr

COPY package.json package.json

RUN yarn

COPY . .

CMD [ "/bin/bash" ]