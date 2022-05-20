#!/bin/sh
mongoimport --collection videos --file videos.json --jsonArray --uri "mongodb://mongo-db:27017/video-streaming"