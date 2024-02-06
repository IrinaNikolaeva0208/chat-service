FROM node:18-alpine As development

WORKDIR /app

COPY src/chat/package*.json ./

RUN npm install

COPY src/chat/ ./src/chat

COPY .env tsconfig.json tsconfig.build.json prisma nest-cli.json ./

RUN npm run build

FROM node:18-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY src/chat/package*.json ./

RUN npm install --only=production

COPY src/chat/ ./src/chat

COPY .env tsconfig.json tsconfig.build.json prisma nest-cli.json ./

RUN npm run build