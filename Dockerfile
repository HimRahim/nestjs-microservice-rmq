FROM node:18-alpine

ARG APP

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build ${APP}

CMD [ "node", "dist/apps/${APP}/main" ]

