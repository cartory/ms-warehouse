FROM node:16.13.0

WORKDIR /dist

COPY package*.json ./
COPY . .

RUN npm install

CMD [ "npm", "start" ]