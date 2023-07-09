#!/bin/bash
sudo cp project-pepper.service /etc/systemd/system/

sudo systemctl start project-pepper
sudo systemctl enable project-pepper
