FROM node:20

# Build time 
RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY ./app/package.json .

# To install needed libraries in /app/node_modules based on package.json
RUN npm install

COPY ./app .

# Script to install new libraries if needed
COPY ./tools/install_libraries.sh /usr/local/bin/install_libraries.sh
RUN chmod +x /usr/local/bin/install_libraries.sh

EXPOSE 5173

# Run time 
ENTRYPOINT [ "/usr/local/bin/install_libraries.sh" ]
CMD ["npm", "run", "dev", "--", "--host"]