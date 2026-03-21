#!/bin/bash

# Copy service and timer files to systemd
sudo cp watchedPot.service /etc/systemd/system/watchedPot.service
sudo systemctl daemon-reload
sudo systemctl enable watchedPot.service
sudo systemctl start watchedPot.service
