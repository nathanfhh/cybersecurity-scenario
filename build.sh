#!/bin/bash
docker build --platform linux/amd64 -t ghcr.io/nathanfhh/cstt-frontend:latest .
docker push ghcr.io/nathanfhh/cstt-frontend:latest