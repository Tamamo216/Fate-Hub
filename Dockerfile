FROM node:current-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY ./src /app/src
ENV PORT 2106
CMD ["npm", "run", "prod"]