FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY common/package*.json ./common/
COPY api-gateway/package*.json ./api-gateway/

RUN npm install

COPY common/ ./common/
COPY api-gateway/ ./api-gateway/

RUN npm run build -w @brisq/common
RUN npm run build -w api-gateway

WORKDIR /app/api-gateway

EXPOSE 3000

CMD ["npm", "run", "dev"]
