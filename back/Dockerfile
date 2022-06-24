###
## BACK END DOCKERFILE
###

FROM node:lts-alpine

COPY ./     /app/

WORKDIR /app

RUN  yarn install

CMD ["yarn", "run", "start"]