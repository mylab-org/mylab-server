FROM node:24

WORKDIR /src

COPY package.json yarn.lock ./
RUN yarn install
COPY . .

CMD ["yarn", "start:dev"]