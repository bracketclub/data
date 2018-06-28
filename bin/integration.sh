#!/usr/bin/env bash

echo "Clearing test DB"
./bin/db.sh bracketclub-test test

ARGS=$@
PIDS=()
# TODO: add wcm once there is data
SPORTS=("ncaam" "ncaaw" "nba" "nhl")
TYPES=("entries" "scores" "users")
YEAR=`date +%Y`

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
  if [ -a "node_modules/bracket-data/data/${SPORT}/${YEAR}.json" ]; then
    echo "node integration/${TYPE} --sport=${SPORT} --year=${YEAR} $ARGS"
    node integration/${TYPE} --sport=${SPORT} --year=${YEAR}  $ARGS &
    PIDS+=($!)
  fi
done; done

while true; do sleep 1; done
