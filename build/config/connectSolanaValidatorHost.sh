#!/bin/bash

USERNAME="solana"
SOLANA_VERSION=$1
SOLANA_CLUSTER=$2
EXTRA_OPTS=$3

VERSION=${SOLANA_VERSION:="1.8.11"}

SOLANA_DIR="/home/${USERNAME}/.local/share/solana/install/releases/${VERSION}/solana-release/bin/"

# Wait a bit before starting
sleep 5s

# Wait for solana to be installed
while [ ! -f ${SOLANA_DIR}/solana-sys-tuner ]
do
    echo "Waiting for solana to be installed"
    sleep 15s
done

# Wait for solana keys
while [ ! -f /home/${USERNAME}/validator-keypair.json ]
do
    echo "Waiting for solana validator keypair upload"
    sleep 15s
done
while [ ! -f /home/${USERNAME}/vote-account-keypair.json ]
do
    echo "Waiting for solana vote account keypair upload"
    sleep 15s
done

# stop eventual stale validator processes
pkill solana-validator

sudo -u ${USERNAME} sh -c "${SOLANA_DIR}/solana-validator \
  --identity /home/${USERNAME}/validator-keypair.json \
  --vote-account /home/${USERNAME}/vote-account-keypair.json \
  --ledger /home/${USERNAME}/ledger \
  --rpc-port 8899 \
  --entrypoint entrypoint.${SOLANA_CLUSTER}.solana.com:8001 \
  --limit-ledger-size \
  --log - \
  ${EXTRA_OPTS}"
