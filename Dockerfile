FROM node:19-alpine3.16
RUN deluser --remove-home node && addgroup -S node -g 999 \ && adduser -S -G node -u 999 node
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD [ "node", "app.js"]

