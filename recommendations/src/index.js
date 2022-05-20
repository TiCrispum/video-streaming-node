const express = require("express");
const bodyParser = require("body-parser");

function startHttpServer() {
    return new Promise(resolve => {
        const app = express();
        app.use(bodyParser.json());

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        app.listen(port, () => {
            resolve();
        });
    });
}

function main() {
    return startHttpServer();
}

main()
    .then(() => console.log("Microservice online."))
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
    });