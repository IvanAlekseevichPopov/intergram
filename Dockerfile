FROM node:9

WORKDIR /app
EXPOSE 3000

COPY ./ /app/

RUN npm install
RUN npm run build

CMD npm run start
