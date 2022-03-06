## Using Docker Compose:
Type `docker compose up --build` to run the application
Use `docker compose ps` to check the list of running containers related to the current docker-compose file
Use `docker compose stop` to gracefully shutdown while keeping containers
Use `docker compose down` to gracefully shut down and remove the containers after shutdown (preferred)

# Environment Variables:
Please set the environment variables `STORAGE_ACCOUNT_NAME` and `STORAGE_ACCESS_KEY`:

`export STORAGE_ACCOUNT_NAME=<fill with your storage account name>`

`export STORAGE_ACCESS_KEY=<fill with your storage account access key>`

# Reminder:
Once you move to Kubernetes, make sure the cluster is stateless. Storage should never be handled within the cluster (video, databases, metadata...). 