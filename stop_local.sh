#!/bin/bash

set -e

docker-compose -f docker-compose.local.yml down -v --remove-orphan
