#!/bin/bash
cd /var/www/html 
source ./env   

export DATABASE_URL=$DATABASE_URL
export HONEYCOMB_API_KEY=$HONEYCOMB_API_KEY

sudo cp project-pepper.service /etc/systemd/system/
cd code/backend
sudo npm i
sudo ./migrate-seed-build.sh $DATABASE_URL
#npm run start-instrumented
#HONEYCOMB_API_KEY=(echo $HONEYCOMB_API_KEY) OTEL_SERVICE_NAME=(echo $OTEL_SERVICE_NAME) npm run start-instrumented
sudo systemctl start project-pepper
sudo systemctl enable project-pepper
