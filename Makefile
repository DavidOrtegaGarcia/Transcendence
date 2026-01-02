all: up

up:
	mkdir -p ./srcs/database
	docker compose -f ./srcs/docker-compose.yml up -d --build #-d to run docker a background process

down:
	docker compose -f ./srcs/docker-compose.yml down
clean:
	#rm -rf ./srcs/database
	
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
		docker network rm inception; \
	fi
re: clean up