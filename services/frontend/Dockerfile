FROM node:20

# BUILD TIME
RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY ./app/package.json .
COPY ./app/package-lock.json .

# To install needed dependencies in /app/node_modules based on package.json
RUN npm install

COPY ./app .

# Script to install new dependencies if needed
COPY ./tools/install_dependencies.sh /usr/local/bin/install_dependencies.sh
RUN chmod +x /usr/local/bin/install_dependencies.sh

EXPOSE 5173

# RUN TIME
ENTRYPOINT [ "/usr/local/bin/install_dependencies.sh" ]
CMD ["npm", "run", "dev", "--", "--host"]