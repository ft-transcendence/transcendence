# Transcendence

Transcendence is a 42 school project, to learn about web developpement and SPA.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Have npx & nestJS installed

### Built With

* [React](https://reactjs.org/) - A JavaScript library for building user interfaces
* [NestJS](https://nestjs.com/) - A progressive Node.js framework for server-side applications.
* [PostgreSQL](https://www.postgresql.org/) - Open source object-relational database system
* [NGINX](https://www.nginx.com/) - Open-source HTTP server and reverse proxy

## Deployment

### Docker-compose

- run `docker-compose up --build`
- go to `http://localhost:3000/`

Nginx reverse proxy redirects to the front.

## Dev phase

### Front-end

Front-end boiler plate was generated using `npx create-react-app front`.
- `cd front`
- run `npm run start`
- go to `http://localhost:1024` or `http://localhost:3000/`

This way, any changes in the src/App.js file is immediatly visible.

### Back-end

Back-end boiler plate was generated using `npx @nestjs/cli new back`.
- `cd back`
- run `npm run start` or `npm run start:dev` to watch for changes in your files
- go to `http://localhost:1024/back` or `http://localhost:4000/`