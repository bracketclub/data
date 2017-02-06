#!/usr/bin/env bash

export NODE_ENV="test"

echo "Clearing test DB"
./bin/db.sh bracketclub-test test

ARGS=$@
PIDS=()
SPORTS=("ncaam" "ncaaw" "nba" "nhl")
TYPES=("entries" "scores" "users")

handler()
{
  echo "Exiting"
  for PID in "${PIDS[@]}"
  do
    echo "Stopping ${PID}"
    kill -s SIGINT $PID 2>/dev/null
  done
}

trap handler EXIT

echo "==============================="
echo "==============================="
echo "Start the server now"
echo "==============================="
echo "==============================="

for SPORT in "${SPORTS[@]}"; do for TYPE in "${TYPES[@]}"; do
  echo "node integration/${TYPE} --sport=${SPORT} $ARGS"
  node integration/${TYPE} --sport=${SPORT} $ARGS &
  PIDS+=($!)
done; done

while true; do sleep 60; done
