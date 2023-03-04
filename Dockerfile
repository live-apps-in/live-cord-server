FROM node:16-alpine
WORKDIR /usr/src/live_cord
COPY package.json .
RUN npm install -g typescript cpx
RUN npm install
COPY . .
RUN npm run build
RUN npm run copy:assets
CMD ["node", "./dist/src/main.js"]
EXPOSE 5000