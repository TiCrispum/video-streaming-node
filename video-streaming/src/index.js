const express = require('express')
const http = require("http");
const mongodb = require("mongodb");

const app = express()

if (!process.env.PORT) {
    throw new Error("Please specify the port number for the HTTP server with the environment variable PORT.");
}

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

function main() {

    return mongodb.MongoClient.connect(DBHOST)
        .then(client => {
            const db = client.db(DBNAME);
            const videosCollection = db.collection("videos");

            app.get('/video', (req, res) => {
                const videoId = new mongodb.ObjectID(req.query.id);
                videosCollection.findOne({_id: videoId})
                    .then(videoRecord => {
                        if (!videoRecord) {
                            res.sendStatus(404);
                            return;
                        }

                        sendViewedMessage(videoRecord.videoPath);

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
        });
}

function sendViewedMessage(videoPath) {
    const postOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const requestBody = {
        videoPath: videoPath
    };

    const req = http.request(
        "http://history/viewed",
        postOptions
    );

    req.on("close", () => {
        return true
    });

    req.on("error", (err) => {
        return false
    });

    req.write(JSON.stringify(requestBody));
    req.end();
}

main()
    .then(() => console.log("Video Streaming Microservice is Up and Running!"))
    .catch(err => {
        console.error("Video Streaming Microservice failed to start.");
        console.error(err && err.stack || err);
    })