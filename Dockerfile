FROM node:16-alpine
WORKDIR /usr/src/live_cord
COPY package.json .
RUN npm install -g typescript
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 5000