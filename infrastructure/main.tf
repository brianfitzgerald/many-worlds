# Config

provider "aws" {
  profile = "personal"
  region  = "us-east-1"
}

# Variables and Output

variable "project_name" {
  type    = "string"
  default = "midnight_sun"
}

output "access_key_id" {
  value = "${aws_iam_access_key.user_client.id}"
}

output "access_key_secret" {
  value = "${aws_iam_access_key.user_client.secret}"
}

# Resources

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

resource "aws_iam_user" "user_client" {
  name = "${var.project_name}-user-client"
  path = "/"
}

resource "aws_iam_access_key" "user_client" {
  user = "${aws_iam_user.user_client.name}"
}

resource "aws_iam_user_policy" "user_client_policy" {
  name = "test"
  user = "${aws_iam_user.user_client.name}"

  policy = "${data.aws_iam_policy_document.user_client_policy_document.json}"
}

data "aws_iam_policy_document" "user_client_policy_document" {
  statement {
    actions = [
      "dynamodb:*",
      "s3:GetBucketLocation",
    ]

    resources = [
      "${aws_dynamodb_table.stories.arn}",
    ]
  }
}
