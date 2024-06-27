# Install Terraform from Homebrew
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# To update Terraform if you already have it
brew update 
brew upgrade hashicorp/tap/terraform

# To verify the installation
terraform -help
terraform --version
```bash
bigyan@bigyans-MBP _workspace % terraform --version
Terraform v1.9.0
on darwin_amd64

```

# Start Docker Desktop from your Launchpad or run below command

```bash
open -a Docker

```
## Create and work on a directory: terraform_docker_101
```bash
mkdir terraform_docker_101
cd terraform_docker_101

```

# Terraform Phase I - PLAN

Create a file called main.tf and add configuration below

```js

terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.2"
    }
  }
}

provider "docker" {}

resource "docker_image" "nginx" {
  name         = "nginx"
  keep_locally = false
}

resource "docker_container" "nginx" {
  image = docker_image.nginx.image_id
  name  = "tutorial"

  ports {
    internal = 80
    external = 8000
  }
}


```
# Terraform Phase II - Initialize

In this phase, Terraform downloads a plugin called a provider that lets Terraform interact with Docker.


```bash

terraform init 

```
- We should be able to see a folder .terraform with necessary plugins inside

# Terraform Phase III - Apply

This is where actual provisioning of resources specified in plan phase takes place. ie. Provisioning of the NGINX server container 

```bash

terraform apply
# when asked  for confirmation, enter yes and press Enter

```

## Verify successful deployment
- Run docker ps to see running container
- Visit localhost:8000 in your web browser

![alt text](nginx_localhost.png)

```bash

bigyan@bigyans-MBP _workspace % docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED              STATUS              PORTS                  NAMES
2d219f027c33   e0c9858e10ed   "/docker-entrypoint.…"   About a minute ago   Up About a minute   0.0.0.0:8000->80/tcp   tutorial
```

## To wipe out what we have done so far
```bash

terraform destroy
# enter yes, and press enter
```

```bash

bigyan@bigyans-MBP terraform_docker_101 % terraform destroy
docker_image.nginx: Refreshing state... [id=sha256:e0c9858e10ed8be697dc2809db78c57357ffc82de88c69a3dee5d148354679efnginx]
docker_container.nginx: Refreshing state... [id=2d219f027c339cc7b75971552f41bd44bf89a525d8d5bb33a0941b6e8b6c1b9e]

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  # docker_container.nginx will be destroyed
  - resource "docker_container" "nginx" {
      - attach                                      = false -> null
      - command                                     = [
          - "nginx",
          - "-g",
          - "daemon off;",
        ] -> null
      - container_read_refresh_timeout_milliseconds = 15000 -> null
      - cpu_shares                                  = 0 -> null
      - dns                                         = [] -> null
      - dns_opts                                    = [] -> null
      - dns_search                                  = [] -> null
      - entrypoint                                  = [
          - "/docker-entrypoint.sh",
        ] -> null
      - env                                         = [] -> null
      - group_add                                   = [] -> null
      - hostname                                    = "2d219f027c33" -> null
      - id                                          = "2d219f027c339cc7b75971552f41bd44bf89a525d8d5bb33a0941b6e8b6c1b9e" -> null
      - image                                       = "sha256:e0c9858e10ed8be697dc2809db78c57357ffc82de88c69a3dee5d148354679ef" -> null
      - init                                        = false -> null
      - ipc_mode                                    = "private" -> null
      - log_driver                                  = "json-file" -> null
      - log_opts                                    = {} -> null
      - logs                                        = false -> null
      - max_retry_count                             = 0 -> null
      - memory                                      = 0 -> null
      - memory_swap                                 = 0 -> null
      - must_run                                    = true -> null
      - name                                        = "tutorial" -> null
      - network_data                                = [
          - {
              - gateway                   = "172.17.0.1"
              - global_ipv6_prefix_length = 0
              - ip_address                = "172.17.0.2"
              - ip_prefix_length          = 16
              - mac_address               = "02:42:ac:11:00:02"
              - network_name              = "bridge"
                # (2 unchanged attributes hidden)
            },
        ] -> null
      - network_mode                                = "default" -> null
      - privileged                                  = false -> null
      - publish_all_ports                           = false -> null
      - read_only                                   = false -> null
      - remove_volumes                              = true -> null
      - restart                                     = "no" -> null
      - rm                                          = false -> null
      - runtime                                     = "runc" -> null
      - security_opts                               = [] -> null
      - shm_size                                    = 64 -> null
      - start                                       = true -> null
      - stdin_open                                  = false -> null
      - stop_signal                                 = "SIGQUIT" -> null
      - stop_timeout                                = 0 -> null
      - storage_opts                                = {} -> null
      - sysctls                                     = {} -> null
      - tmpfs                                       = {} -> null
      - tty                                         = false -> null
      - wait                                        = false -> null
      - wait_timeout                                = 60 -> null
        # (7 unchanged attributes hidden)

      - ports {
          - external = 8000 -> null
          - internal = 80 -> null
          - ip       = "0.0.0.0" -> null
          - protocol = "tcp" -> null
        }
    }

  # docker_image.nginx will be destroyed
  - resource "docker_image" "nginx" {
      - id           = "sha256:e0c9858e10ed8be697dc2809db78c57357ffc82de88c69a3dee5d148354679efnginx" -> null
      - image_id     = "sha256:e0c9858e10ed8be697dc2809db78c57357ffc82de88c69a3dee5d148354679ef" -> null
      - keep_locally = false -> null
      - name         = "nginx" -> null
      - repo_digest  = "nginx@sha256:9c367186df9a6b18c6735357b8eb7f407347e84aea09beb184961cb83543d46e" -> null
    }

Plan: 0 to add, 0 to change, 2 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes

docker_container.nginx: Destroying... [id=2d219f027c339cc7b75971552f41bd44bf89a525d8d5bb33a0941b6e8b6c1b9e]
docker_container.nginx: Destruction complete after 1s
docker_image.nginx: Destroying... [id=sha256:e0c9858e10ed8be697dc2809db78c57357ffc82de88c69a3dee5d148354679efnginx]
docker_image.nginx: Destruction complete after 0s

Destroy complete! Resources: 2 destroyed.

```