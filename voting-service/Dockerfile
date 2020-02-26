FROM node:10
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3002
CMD ["npm", "run", "serve"]
