FROM node:18

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x app.js

CMD [ "npm","run","start" ]
