# video-storage
A simple video storage streaming service written in Node

## bare-bones (hardware):

To install dependencies:

For production: `npm install --only=production`

For development: `npm install`

To run:

For development (live reload): `nodemon index.js`, `npx nodemon index.js` or the custom `npm run start:dev`

For production: `node index.js` or `npm start`

## In a container:

Build the image: `docker build -t video-storage --file Dockerfile .`

[comment]: <> (Of the format: `docker build -t image-name:tag --file path-to-docker-file path-to-project`)

Run in a container: `docker run -d -p $PORT:$PORT -e PORT -e STORAGE_ACCOUNT_NAME -e STORAGE_ACCESS_KEY video-storage ` to pass the needed port to the container.

[comment]: <> (The internal ports are not important,  the important one is the port in which to expose it)

You can also connect to you repository using: `docker login registry-url --username your-username --password-stdin`
It can be dockerhub, video container registry, or anything really.
`your password`

And then tag `docker tag video-storage ticrispum.azurecr.io/video-storage:latest` (private) or 
`docker tag video-storage khalilswdp/video-storage:latest` (public) and push the locally built image to the registry:
`docker push ticrispum.azurecr.io/vieo-storage:latest ` or `docker push khalilswdp/video-storage:latest `

# Environment Variables:
Please set the environment variable `PORT` with the desired port you want the application to listen on before running the application, otherwise it'll fail.
You also need to set the environment variables `STORAGE_ACCOUNT_NAME` and `STORAGE_ACCESS_KEY` to the variables that allow you to use your video storage.

e.g. 
`export PORT=3000`
`export STORAGE_ACCOUNT_NAME=<fill with your storage account name>`
`export STORAGE_ACCESS_KEY=<fill with your storage account access key>`