## Using Docker Compose:
Type `docker compose -f docker-compose-dev.yml up --build` to run the application (especially if you changed or added a package, otherwise, omit the --build)
Use `docker compose -f docker-compose-dev.yml ps` to check the list of running containers related to the current docker-compose file
Use `docker compose -f docker-compose-dev.yml stop` to gracefully shutdown while keeping containers
Use `docker compose -f docker-compose-dev.yml down` to gracefully shut down and remove the containers after shutdown (preferred)

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

# Terraform
We are now making a switch to using terraform with an Azure Account.
First apply `terraform init` to initialize the tfstate and download the providers (I'm not commiting the state because it might contain private and sensitive data)
Use `terraform plan` to see what terraform will do. `terraform apply` to apply changes to the infrastructure and `terraform destroy` if you want to destroy the infrastructure (to avoid incurring huge costs by leaving things open).
Append `-auto-approve` if you don't wish to keep saying yes and confirming your actions
Use `terraform output registry_pw` to show the password of the created registry's password, otherwise, it won't be shown.

We need to manually create the service principal in order to allow kubernetes to talk with azure in a secure way:
Use `az account show` and get the id, then perform `az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<The-id-you-copied>"`
Take the `appId` and `password` from the previous command's output, and put them in the `variables.tf` variables `client_id` and `client_secret`. (If afraid you'll commit them mistakenly, then just omit them from variables.tf file and terraform will prompt you for them when you try to apply)

In order to authenticate with kubernetes (locally installed kubectl with azure kubernetes service) you can use the following command: `az aks get-credentials --resource-group ticrispum --name ticrispum` which will automatically get and set the `~/.kube/config` file with the relevant details: `cluster_client_certificate, cluster_client_key, cluster_ca_certificate`
Now that kubectl is initialized, you can use it. Or, you can install the dashboard `kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml` and use it `kubectl proxy` and visit ` http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/` and then authenticating using the `~/.kube/config` file

