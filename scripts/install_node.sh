#!/bin/bash
sudo apt update
sudo apt-get install -y nodejs
sudo apt-get install -y npm

directory="/var/www/html/"

if [ -z "$(ls -A "$directory")" ]; then
    echo "Directory is empty"
else
   sudo rm -rf "$directory"/*
   echo "Directory is not empty"
fi

