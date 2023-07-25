#!/bin/bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y apache2

sudo cp scripts/project-pepper.conf /etc/apache2/sites-available/
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2dissite 000-default.conf
sudo a2ensite project-pepper.conf
sudo systemctl reload apache2

directory="/var/www/html/"

if [ -z "$(ls -A "$directory")" ]; then
    echo "Directory is empty"
else
   sudo rm -rf "$directory"/*
   echo "Directory is not empty"
fi

