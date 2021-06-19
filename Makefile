all: help

##################
# local commands
##################

test:
	./test.sh

# ===

docker-build: ## build the web container
	docker-compose build app

docker-up: ## start the docker containers
	docker-compose up -d

docker-bash: ## run bash in the container
	docker-compose run --rm app bash

docker-stop: ## stop the docker containers
	docker-compose stop

docker-down: ## stop & destroy the docker containers
	docker-compose down

docker-test:
	docker-compose run --rm app make test

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

