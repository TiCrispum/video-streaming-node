const express = require('express');
const azure = require('azure-storage');

const app = express();

const PORT = process.env.PORT && parseInt(process.env.PORT)
const STORAGE_ACCOUNT_NAME =
    process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY =
    process.env.STORAGE_ACCESS_KEY;

function createBlobService() {
    const blobService = azure.createBlobService(STORAGE_ACCOUNT_NAME,
        STORAGE_ACCESS_KEY);
    return blobService;
}

app.get('/video', (req, res) => {

    const videoPath = req.query.path;
    const blobService = createBlobService();

    const containerName = 'videos';
    blobService.getBlobProperties(containerName, videoPath, (err, properties) => {
        if (err) {
            // ... error handling ...
            res.sendStatus(500);
            return;
        }

        res. writeHead(200, {
            'Content-Length': properties.contentLength,
            'Content-Type': 'video/mp4',
        });

        blobService.getBlobToStream(containerName, videoPath, res, err => {
            if (err) {
                // ... error handling ...
                // res.sendStatus(500);
                return;
            }
        });
        console.log('Serving videos from the azure account: ' + STORAGE_ACCOUNT_NAME)
    });
});

app.listen(PORT, () => {
    console.log('Video Streaming Service is Up and Running!');
})