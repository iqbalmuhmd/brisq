FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY asset/package*.json ./asset/

RUN npm install

COPY common/ ./common/
COPY asset/ ./asset/

RUN npm run build -w @brisq/common

WORKDIR /app/asset

EXPOSE 3003

CMD ["npm", "run", "dev"]
