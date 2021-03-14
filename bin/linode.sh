#!/usr/bin/env bash

COMMAND=$1

LABEL="bracketclub"

STACKSCRIPT_ID=$(linode-cli stackscripts list --is_public false --label "$LABEL" --json | ./node_modules/.bin/json 0.id)
LINODE=$(linode-cli linodes list --label $LABEL --json)
LINODE_ID=$(echo $LINODE | ./node_modules/.bin/json 0.id)

if [ "$COMMAND" == "delete" ]; then
  ## =============
  ## Delete Linode
  ## ===========

  if [ "$LINODE_ID" == "" ]; then
    echo "No Linode found to delete"
  else
    echo "Deleting $LINODE_ID"
    linode-cli linodes delete "$LINODE_ID"
  fi

elif [ "$COMMAND" == "stackscript" ]; then
  ## =============
  ## Update StackScript
  ## ===========

  if [ "$STACKSCRIPT_ID" == "" ]; then
    echo "No StackScript found to update"
  else
    echo "Updating StackScript $STACKSCRIPT_ID"
    linode-cli stackscripts update "$STACKSCRIPT_ID" --script ./bin/StackScript
  fi

elif [ "$COMMAND" == "ip" ]; then
  ## =============
  ## Show Linode IP
  ## ===========

  echo $LINODE | ./node_modules/.bin/json 0.ipv4.0
  
elif [ "$COMMAND" == "show" ]; then
  ## =============
  ## Show Linode data
  ## ===========

  echo $LINODE | ./node_modules/.bin/json 0

elif [ "$COMMAND" == "build" ]; then
  ## =============
  ## Rebuild or create Linode
  ## ===========

  if [ "$LINODE_ID" == "" ]; then
    echo "Creating Linode"
    linode-cli linodes create \
      --no-defaults \
      --region "us-west" \
      --type "g6-nanode-1" \
      --label "$LABEL" \
      --authorized_keys "$(cat ./linode.pub)" \
      --image "linode/ubuntu16.04lts" \
      --stackscript_id "$STACKSCRIPT_ID" \
      --stackscript_data "$(./bin/stack-script-json.js)" \
      --root_pass "$(./bin/password.js)"
  else
    echo "Rebuilding Linode with $LINODE_ID"
    linode-cli linodes rebuild "$LINODE_ID" \
      --no-defaults \
      --authorized_keys "$(cat ./linode.pub)" \
      --image "linode/ubuntu16.04lts" \
      --stackscript_id "$STACKSCRIPT_ID" \
      --stackscript_data "$(./bin/stack-script-json.js)" \
      --root_pass "$(./bin/password.js)"
  fi
fi
