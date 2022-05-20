const express = require('express')
const http = require("http");
const mongodb = require("mongodb");
const amqp = require("amqplib");

const app = express()

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

if (!process.env.RABBIT) {
    throw new Error("Please specify the RabbitMQ host using environment variable RABBIT");
}

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;
const RABBIT = process.env.RABBIT;

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
    const videosCollection = db.collection("videos");

    app.get('/video', (req, res) => {
        const videoId = new mongodb.ObjectID(req.query.id);
        videosCollection.findOne({_id: videoId})
            .then(videoRecord => {
                if (!videoRecord) {
                    res.sendStatus(404);
                    return;
                }

                sendViewedMessage(messageChannel, videoRecord.videoPath);

                const forwardRequest = http.request(
                    {
                        host: VIDEO_STORAGE_HOST,
                        port: VIDEO_STORAGE_PORT,
                        path: `/video?path=${videoRecord.videoPath}`,
                        method: 'GET',
                        headers: req.headers
                    },
                    forwardResponse => {
                        console.log('Forwarding video requests to ' + VIDEO_STORAGE_HOST + ':' + VIDEO_STORAGE_PORT)
                        res.writeHead(forwardResponse.statusCode, forwardResponse.headers);
                        forwardResponse.pipe(res);
                    }
                );
                req.pipe(forwardRequest);
            })
            .catch(err => {
                console.error("Database query failed.");
                console.error(err && err.stack || err);
                res.sendStatus(500);
            });
    });

    app.listen(PORT, () => {
        console.log(`Video Streaming Microservice is Up and Running!`)
    });
}

function main() {

    return connectDb()
        .then(db => {
            return connectRabbit()
                .then(messageChannel => {
                    return startHttpServer(db, messageChannel);
                });
        })
}

function sendViewedMessage(messageChannel, videoPath) {
    const msg = {
        videoPath: videoPath
    };

    const jsonMsg= JSON.stringify(msg);

    messageChannel.publish("", "viewed", Buffer.from(jsonMsg));
}

main()
    .then(() => console.log("Video Streaming Microservice is Up and Running!"))
    .catch(err => {
        console.error("Video Streaming Microservice failed to start.");
        console.error(err && err.stack || err);
    })