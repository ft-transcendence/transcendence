###
## FRONT END DOCKERFILE
###

FROM node:lts-alpine

COPY ./     /app/

WORKDIR /app

RUN npm install

CMD ["npm", "run", "start"]