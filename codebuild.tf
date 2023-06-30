data "aws_caller_identity" "capstone" {}

data "aws_s3_bucket" "frontend_bucket" {
  bucket = var.frontend_bucket_name
}

resource "aws_s3_bucket" "capstone" {
  bucket = "capstone-artifact-bucket-20212"
}

resource "aws_s3_bucket_versioning" "artifact_bucket_versioning" {
  bucket = aws_s3_bucket.capstone.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "artifact_bucket_encryption" {
  bucket = aws_s3_bucket.capstone.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
data "aws_iam_policy_document" "capstone_codebuildRoleP" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "capstone_cbRole" {
  name               = "capstone"
  assume_role_policy = data.aws_iam_policy_document.capstone_codebuildRoleP.json
}

data "aws_iam_policy_document" "capstone_project_P" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeDhcpOptions",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",
      "ec2:DescribeSubnets",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeVpcs",
    ]

    resources = ["*"]
  }

  statement {
    effect    = "Allow"
    actions   = ["ec2:CreateNetworkInterfacePermission"]
    resources = ["arn:aws:ec2:us-east-1:123456789012:network-interface/*"]

    condition {
      test     = "StringEquals"
      variable = "ec2:AuthorizedService"
      values   = ["codebuild.amazonaws.com"]
    }
  }

  statement {
    effect  = "Allow"
    actions = ["s3:*"]
    resources = [
      aws_s3_bucket.capstone.arn,
      "${aws_s3_bucket.capstone.arn}/*",
    ]
  }

  statement {
    effect  = "Allow"
    actions = ["s3:*"]
    resources = [
      data.aws_s3_bucket.frontend_bucket.arn,
      "${data.aws_s3_bucket.frontend_bucket.arn}/*",
    ]
  }

}

resource "aws_iam_role_policy" "capstone_cbRole_policy" {
  role   = aws_iam_role.capstone_cbRole.name
  policy = data.aws_iam_policy_document.capstone_project_P.json
}

resource "aws_codebuild_project" "capstone_build" {
  name          = "project-pepper"
  description   = "test_codebuild_project"
  build_timeout = "5"
  service_role  = aws_iam_role.capstone_cbRole.arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

  }

  logs_config {
    cloudwatch_logs {
      group_name  = "log-group"
      stream_name = "log-stream"
    }

  }
  source {
    type            = "GITHUB"
    location        = "https://github.com/Nielae/Altschool-Capstone-project"
    git_clone_depth = 1

    git_submodules_config {
      fetch_submodules = true
    }
  }

  source_version = "master"


  tags = {
    Environment = "Test"
  }
}


