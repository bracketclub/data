#!/usr/bin/env bash

WATCHER=$1
SPORT=$2
COMMAND=${3:-start}

./node_modules/.bin/pm2 $COMMAND pm2.config.js --env production --only $WATCHER-$SPORT
