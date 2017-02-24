#!/usr/bin/env bash

COMMAND=$1
KEY=$2

LINODE="bracketclub"
DISTRO="Ubuntu 16.04 LTS"
SCRIPT="Bracket Data"

if [ "$COMMAND" == "delete" ]; then
  echo "Deleting $LINODE"
  linode delete $LINODE
elif [ "$COMMAND" == "stackscript" ]; then
  echo "Updating StackScript $SCRIPT"
  linode stackscript \
    --action update \
    --label "$SCRIPT" \
    --codefile ./bin/StackScript \
    --distribution "$DISTRO"
elif [ "$COMMAND" == "ip" ]; then
  linode show --label $LINODE | grep ips | awk '{print $2}'
elif [ "$COMMAND" == "show" ]; then
  linode show --label $LINODE
elif [ "$COMMAND" == "build" ]; then
  linode show --label $LINODE
  LINODE_EXISTS=$?
  if [ "$LINODE_EXISTS" == "0" ]; then
    BUILD_COMMAND="rebuild"
  else
    BUILD_COMMAND="create"
  fi
  echo "$BUILD_COMMAND $LINODE"
  linode --action $BUILD_COMMAND \
    --label "$LINODE" \
    --location fremont \
    --plan linode1024 \
    --distribution "$DISTRO" \
    --pubkey-file "$KEY" \
    --stackscript "$SCRIPT" \
    --stackscriptjson `node -e "process.stdout.write(JSON.stringify(require('fs').readFileSync('./.env').toString().split('\n').filter(Boolean).map((l) => l.split('=')).reduce((a, i) => (a[i[0]] = i[1], a), {})))"` \
    --password `dd bs=32 count=1 if="/dev/urandom" | base64 | tr +/ _.`
fi
