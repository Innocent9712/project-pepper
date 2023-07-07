#!/bin/bash
sudo apt update
sudo apt install nodejs
sudo apt install npm

directory="/var/www/html/"

if [ -z "$(ls -A "$directory")" ]; then
    echo "Directory is empty"
else
   rm -rf "$directory"/*
   echo "Directory is not empty"
fi

cp project-pepper.service /etc/systemd/system/
