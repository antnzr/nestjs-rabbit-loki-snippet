#!/bin/bash

set -e

RABBITMQ_CONTAINER=rabbit
COMPOSE_FILE=docker-compose.local.yml

log() { echo -e "\e[37m[INFO] $1\e[0m"; }
error() { echo -e "\e[31m[ERROR] $1\e[0m"; }

if [ ! -f .env ]; then cp ./env.example .env; fi

export_current_user() {
  if [ -z "$UID" ]; then export UID="$(id -u)"; fi
  if [ -z "$GID" ]; then export GID="$(id -g)"; fi
  if [ -z "$CURRENT_UID" ]; then export CURRENT_UID=$UID:$GID; fi
}

export_env() {
  set -a
  if [ ! -f .env ]; then
    error "'.env' file is required"
    exit 1
  fi
  . .env
  set +a
}

wait_rabbit() {
  log "wait rabbit"
  docker-compose -f $COMPOSE_FILE up -d $RABBITMQ_CONTAINER
  until docker exec -it $RABBITMQ_CONTAINER bash -c "cat < /dev/null > /dev/tcp/${RABBITMQ_CONTAINER}/5672"; do
    log "Waiting for rabbit..."
    sleep 1
  done
}

up_containers() {
  log "up containers"
  docker-compose -f $COMPOSE_FILE up --build --remove-orphans
}

run() {
  export_env
  export_current_user
  wait_rabbit
  up_containers
}

run
