# video-streaming-node
A simple video streaming service written in Node

## bare-bones (hardware):

To install dependencies:

For production: `npm install --only=production`

For development: `npm install`

To run:

For development (live reload): `nodemon index.js`, `npx nodemon index.js` or the custom `npm run start:dev`

For production: `node index.js` or `npm start`

## In a container:

Build the image: `docker build -t video-streaming-node --file Dockerfile .`

[comment]: <> (Of the format: `docker build -t image-name:tag --file path-to-docker-file path-to-project`)

Run in a container: `docker run -d -p $PORT:$PORT -e PORT video-streaming-node ` to pass the needed port to the container.

[comment]: <> (The internal ports are not important,  the important one is the port in which to expose it)

You can also connect to you repository using: `docker login registry-url --username your-username --password-stdin`
It can be dockerhub, azure container registry, or anything really.
`your password`

And then tag `docker tag video-streaming-node ticrispum.azurecr.io/video-streaming-node:latest` (private) or 
`docker tag video-streaming-node khalilswdp/video-streaming-node:latest` (public) and push the locally built image to the registry:
`docker push ticrispum.azurecr.io/video-streaming-node:latest ` or `docker push khalilswdp/video-streaming-node:latest `

## Using Docker Compose:
Type `docker compose up --build` to run the application
Use `docker compose ps` to check the list of running containers related to the current docker-compose file
Use `docker compose stop` to gracefully shutdown while keeping containers
Use `docker compose down` to gracefully shut down and remove the containers after shutdown (preferred)

# Environment Variables:
Please set the environment variable `PORT` with the desired port you want the application to listen on before running the application, otherwise it'll fail.
e.g. 
`export PORT=3000`