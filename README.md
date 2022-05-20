## Using Docker Compose:
Type `docker compose up --build` to run the application
Use `docker compose ps` to check the list of running containers related to the current docker-compose file
Use `docker compose stop` to gracefully shutdown while keeping containers
Use `docker compose down` to gracefully shut down and remove the containers after shutdown (preferred)

# Environment Variables:
Please set the environment variables `STORAGE_ACCOUNT_NAME` and `STORAGE_ACCESS_KEY`:

`export STORAGE_ACCOUNT_NAME=<fill with your storage account name>`

`export STORAGE_ACCESS_KEY=<fill with your storage account access key>`

# The Database
Don't forget to load sample data into your database. Namely the id -> videoPath pair. (We will add a mongo-seed to preload sample data)
Use the paths:
`http://localhost:4000/video?id=5d9e690ad76fe06a3d7ae416` as a nice abstraction to hide where the file really is and its name (what we want people to use)
or
`http://localhost:4001/video?path=SampleVideo_1280x720_1mb.mp4` if you want to probe more internally (to be hidden eventually)
# Reminder:
Once you move to Kubernetes, make sure the cluster is stateless. Storage should never be handled within the cluster (video, databases, metadata...). 