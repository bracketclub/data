#!/usr/bin/env bash

export NODE_ENV="test"

echo "Clearing test DB"
dropdb --if-exists tweetyourbracket-test
createdb tweetyourbracket-test
psql -d tweetyourbracket-test -f sql/test.sql 2>&1 >/dev/null

PIDS=()
YEAR="2016"
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

echo "Start the server now"

for SPORT in "${SPORTS[@]}"; do for TYPE in "${TYPES[@]}"; do
  node integration/${TYPE} --year=${YEAR} --sport=${SPORT} &
  PIDS+=($!)
done; done

while true; do sleep 60; done
