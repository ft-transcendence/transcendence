# Docker compose file location
COMPOSE		=	docker-compose.yml

# Change this to suit your compose version

COMPOSE_CMD	= 	docker compose -f ${COMPOSE}

build:
	${COMPOSE_CMD} up --build

up:
	${COMPOSE_CMD} up

down:
	${COMPOSE_CMD} down

dbclean: down
	rm -rf back/prisma/migrations && docker volume prune -f

clean: dbclean volume-clean
	rm -rf back/dist back/node_modules front/node_modules

fclean: down clean
	docker system prune -af

.PHONY: all build up down clean fclean