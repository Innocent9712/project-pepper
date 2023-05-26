#!/bin/bash

# Parse command-line arguments
while [[ $# -gt 0 ]]
do
    key="$1"

    case $key in
        -h|--host)
        MYSQL_HOST="$2"
        shift
        shift
        ;;
        -u|--user)
        MYSQL_USER="$2"
        shift
        shift
        ;;
        --password)
        MYSQL_PASSWORD="$2"
        shift
        shift
        ;;
        *)    # unknown option
        echo "Unknown option: $1"
        exit 1
        ;;
    esac
done

# Check if required options are set
if [[ -z "$MYSQL_HOST" || -z "$MYSQL_USER" ]]; then
    echo "Usage: ./createdb.sh -h <mysql_host> -u <mysql_user> --password <mysql_password>"
    exit 1
fi

# Ask for password if not provided as an argument
if [[ -z "$MYSQL_PASSWORD" ]]; then
    read -s -p -r "Enter MySQL password: " MYSQL_PASSWORD
    echo
fi

# Database name
DB_NAME=pepper

# MySQL port
MYSQL_PORT=3306

# Create database
mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
