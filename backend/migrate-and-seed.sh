#!/usr/bin/env bash

# Read the database URL from command-line argument
DATABASE_URL="$1"

# Read the database URL from AWS Secret Manager
# DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id your-secret-id --region your-region --output=text --query=SecretString)

# Validate if the database URL is provided
if [[ -z $DATABASE_URL ]]; then
  echo "Error: Database URL is required."
  echo "Usage: ./migrate-and-seed.sh <database-url>"
  exit 1
fi

# Set the database URL as an environment variable
export DATABASE_URL

# Generate the Prisma client with the specified schema
npx prisma generate --schema ./src/prisma/schema.prisma

# Check if the database needs to be migrated
hasMigrations=$(npx prisma db push --preview-feature 2>&1 | grep "Database is already up to date.")

if [[ $hasMigrations ]]; then
  echo "Database is already up to date. Skipping migration."
else
  # Run the migrations with the specified schema
  npx prisma migrate deploy --preview-feature --skip-generate --schema ./src/prisma/schema.prisma

  # Seed the database with the specified schema
  npx prisma db seed --preview-feature --schema ./src/prisma/schema.prisma
fi
