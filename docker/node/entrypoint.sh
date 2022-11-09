#!/bin/bash
set -e;
if [ "$NODE_ENV" = "production" -a "$1" = "" ]; then
  echo "Starting on production..." && npm install;
  set -- npm run start;
elif [ "$NODE_ENV" = "development" -a "$1" = "" ]; then
  echo "Starting on development..." && npm install;
  set -- npm run start:dev;
elif [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi
exec "$@"