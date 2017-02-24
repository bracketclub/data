#!/usr/bin/env bash

COMMAND=$1
KEY=$2

LINODE="bracketclub"
DISTRO="Ubuntu 16.04 LTS"
SCRIPT="Bracket Data"

if [ "$COMMAND" == "delete" ]; then
  linode delete $LINODE
elif [ "$COMMAND" == "stackscript" ]; then
  linode stackscript \
    --action update \
    --label "$SCRIPT" \
    --codefile ./bin/StackScript \
    --distribution "$DISTRO"
elif [ "$COMMAND" == "build" ]; then
  linode show $LINODE
  LINODE_EXISTS=$?
  if [ "$LINODE_EXISTS" == "0" ]; then
    BUILD_COMMAND="rebuild"
  else
    BUILD_COMMAND="create"
  fi
  linode $BUILD_COMMAND bracketclub \
    --location fremont \
    --plan linode1024 \
    --distribution "$DISTRO" \
    --stackscript "$SCRIPT" \
    --stackscriptjson `node -e "process.stdout.write(JSON.stringify(require('fs').readFileSync('./.env').toString().split('\n').filter(Boolean).map((l) => l.split('=')).reduce((a, i) => (a[i[0]] = i[1], a), {})))"` \
    --password `cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1` \
    --pubkey-file "$KEY"
elif [ "$COMMAND" == "ip" ]; then
  linode show $LINODE | grep ips | awk '{print $2}'
fi
