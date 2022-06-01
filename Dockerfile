FROM node:16-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD npm run build
CMD npm run dev