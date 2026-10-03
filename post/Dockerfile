FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY post/package*.json ./post/

RUN npm install

COPY common/ ./common/
COPY post/ ./post/

RUN npm run build -w @brisq/common

WORKDIR /app/post

EXPOSE 3002

CMD ["npm", "run", "dev"]