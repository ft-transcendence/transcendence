# TRANSCENDENCE MAKEFILE


# Docker compose file location
COMPOSE		=	docker-compose.yml

# Change this to suit your compose version

COMPOSE_CMD = docker-compose -f ${COMPOSE}
#COMPOSE_CMD	= 	docker compose -f ${COMPOSE}

# BASIC COMPOSE COMMANDS
build:
	${COMPOSE_CMD} up --build

up:
	${COMPOSE_CMD} up

down:
	${COMPOSE_CMD} down

# CLEAN DATABASES
dbclean: down
	rm -rf back/prisma/migrations && docker volume prune -f

clean: dbclean
	rm -rf back/dist back/node_modules front/node_modules

# PRUNE DOCKER CONTAINERS
fclean: down clean
	docker system prune -af

.PHONY: all build up down clean fclean