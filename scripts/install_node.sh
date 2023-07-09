#!/bin/bash
sudo apt update
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

directory="/var/www/html/"

if [ -z "$(ls -A "$directory")" ]; then
    echo "Directory is empty"
else
   sudo rm -rf "$directory"/*
   echo "Directory is not empty"
fi

