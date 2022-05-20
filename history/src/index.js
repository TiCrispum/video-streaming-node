const express = require("express");
const mongodb = require("mongodb");
const amqp = require("amqplib");
const bodyParser = require("body-parser");

if (!process.env.DBHOST) {
    throw new Error("Please specify the database host using environment variable DBHOST.");
}

if (!process.env.DBNAME) {
    throw new Error("Please specify the name of the database using environment variable DBNAME");
}

if (!process.env.RABBIT) {
    throw new Error("Please specify the RabbitMQ host using environment variable RABBIT");
}

const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;
const RABBIT = process.env.RABBIT;

function setupHandlers(app, db, messageChannel) {
    const videosCollection = db.collection("videos");

    function consumeViewedMessage(msg) {
        const parsedMsg = JSON.parse(msg.content.toString());

        return videosCollection.insertOne({ videoPath: parsedMsg.videoPath })
            .then(() => {
                console.log(`Added video ${parsedMsg.videoPath} to history.`);
                messageChannel.ack(msg);
            }).catch(err => {
                console.error(`Error adding video ${parsedMsg.videoPath} to history.`);
                console.error(err && err.stack || err);
            })
    }

    return messageChannel.assertQueue("viewed", {})
        .then(() => {
            return messageChannel.consume("viewed", consumeViewedMessage);
        })
}

function connectDb() {
    return mongodb.MongoClient.connect(DBHOST)
        .then(client => {
            return client.db(DBNAME);
        });
}

function connectRabbit() {
    return amqp.connect(RABBIT)
        .then(messagingConnection => {
            return messagingConnection.createChannel();
        });
}

function startHttpServer(db, messageChannel) {
    return new Promise(resolve => {
        const app = express();
        app.use(bodyParser.json());
        setupHandlers(app, db, messageChannel);

        const port = process.env.PORT && parseInt(process.env.PORT) || 3000;
        app.listen(port, () => {
            resolve();
        });
    });
}

function main() {
    console.log("Hello world!");

    return connectDb()
        .then(db => {
            return connectRabbit()
                .then(messageChannel => {
                    return startHttpServer(db, messageChannel);
                });
        })

}

main()
    .then(() => console.log("Microservice online."))
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
    });