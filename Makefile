all: up

up:
	mkdir -p $(CURDIR)/database
	mkdir -p $(CURDIR)/certs
	mkdir -p $(CURDIR)/private
	docker compose up -d --build #-d to run docker as a background process

down: 
	docker compose down
clean: down
	# We create a tmp container to remove the mount volumes
	docker run --rm -v $(CURDIR):/tmp alpine rm -rf /tmp/database /tmp/certs /tmp/private

	@if [ ! -z "$$(docker ps -qa)" ]; then \
		docker stop $$(docker ps -qa); \
		docker rm $$(docker ps -qa); \
	fi
	@if [ ! -z "$$(docker images -qa)" ]; then \
		docker rmi $$(docker images -qa); \
	fi
	@if [ ! -z "$$(docker volume ls -q)" ]; then \
		docker volume rm $$(docker volume ls -q); \
	fi
	@if [ ! -z "$$(docker network ls | grep transcendence)" ]; then \
		docker network rm transcendence; \
	fi
re: clean up