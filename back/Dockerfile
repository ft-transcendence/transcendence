FROM debian:latest

WORKDIR /back

RUN apt update && apt install -y npm

COPY . /back

RUN npm i

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]