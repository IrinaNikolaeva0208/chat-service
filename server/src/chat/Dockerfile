FROM node:18-alpine As development

WORKDIR /app

COPY package*.json .

RUN npm install

COPY src/ ./src/

COPY .env tsconfig.json tsconfig.build.json nest-cli.json ./

RUN npm run build

FROM node:18-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json .

RUN npm install --only=production

COPY src/ ./src/

COPY .env tsconfig.json tsconfig.build.json nest-cli.json ./

RUN npm run build