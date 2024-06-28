terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}


resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}

resource "aws_instance" "app_server" {
  ami           = "ami-0583d8c7a9c35822c"
  instance_type = "t2.micro"
  vpc_security_group_ids = ["sg-0572aba9474b67b37"]
  subnet_id              = "subnet-02da5c8da4d23cd6c"

  tags = {
    Name = "EC2ServerInstanceExample"
  }
}




