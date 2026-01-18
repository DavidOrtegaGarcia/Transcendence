FROM node:20

# Build time 
RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY ./app/package*.json ./

# To install libraries needed in /app/node_modules folder 
RUN npm install

COPY ./app .

# Script to install new libraries if needed
COPY ./docker_utils/install_libraries.sh /usr/local/bin/install_libraries.sh
RUN chmod +x /usr/local/bin/install_libraries.sh

EXPOSE 5173

# Run time 
ENTRYPOINT [ "/usr/local/bin/install_libraries.sh" ]
CMD ["npm", "run", "dev", "--", "--host"]