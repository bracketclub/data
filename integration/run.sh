#!/usr/bin/env bash

# npm run test:clean:db

export NODE_ENV="test"

PIDS=()
YEAR="2016"
SPORTS=("ncaam" "ncaaw" "nba" "nhl")

handler()
{
  for PID in "${PIDS[@]}"
  do
    echo "Kill ${PID}"
    kill -s SIGINT $PID
  done
}

trap handler EXIT

for SPORT in "${SPORTS[@]}"
do
  echo "Start entries ${SPORT} ${YEAR}"
  node integration/entries --year=${YEAR} --sport=${SPORT} &
  PIDS+=($!)

  echo "Start scores ${SPORT} ${YEAR}"
  node integration/scores --year=${YEAR} --sport=${SPORT} &
  PIDS+=($!)

  echo "Start users ${SPORT} ${YEAR}"
  node integration/users --year=${YEAR} --sport=${SPORT} &
  PIDS+=($!)
done

while true
do
  sleep 60
done
