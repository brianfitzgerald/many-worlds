provider "aws" {
  profile = "personal"
  region  = "us-east-1"
}

resource "aws_dynamodb_table" "stories" {
  name           = "${var.project_name}-stories"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
