# video-streaming-node
A simple video streaming service written in Node

To install dependencies:

For production: `npm install --only=production`

For development: `npm install`

To run:

For development (live reload): `npx nodemon index.js`

For production: `node index.js` or `npm start` 

Please set the environment variable PORT with the desired port you want the application to listen on before running the application, otherwise it'll fail.

e.g. use `export PORT=3000`