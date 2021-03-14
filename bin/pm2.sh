#!/usr/bin/env bash

WATCHER=$1
SPORT=$2
COMMAND=${3:-start}


if [[ "$COMMAND" == "logs" ]]; then
  ./node_modules/.bin/pm2 logs $WATCHER-$SPORT
elif [[ "$NODE_ENV" == "production" || "$(hostname)" == "localhost" ]]; then
  echo "Starting production mode for $WATCHER $SPORT"
  ./node_modules/.bin/pm2 $COMMAND pm2.config.js --env production --only $WATCHER-$SPORT
else
  echo "Starting dev mode for $WATCHER $SPORT"
  ./node_modules/.bin/pm2 $COMMAND pm2.config.js --only $WATCHER-$SPORT
fi

