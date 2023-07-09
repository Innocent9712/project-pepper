#!/bin/bash

SERVICE_FILE="/etc/systemd/system/project-pepper.service"

 # Check if the service file exists
 if [ -f "$SERVICE_FILE" ]; then
   # Stop the service
   sudo systemctl stop project-pepper.service
 else
   echo "Service file not found. Skipping service stop."
 fi
