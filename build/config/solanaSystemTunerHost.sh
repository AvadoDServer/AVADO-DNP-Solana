#!/bin/bash

SOLANA_VERSION=$1
VERSION=${SOLANA_VERSION:="1.8.11"}

SOLANA_DIR="/home/solana/.local/share/solana/install/releases/${VERSION}/solana-release/bin/"

# Wait a bit before starting
sleep 5s

# Wait for solana to be installed
while [ ! -f ${SOLANA_DIR}/solana-sys-tuner ]
do
    echo "Waiting for solana to be installed"
    sleep 15s
done

echo "Starting the solana system tuner"
/home/solana/.local/share/solana/install/releases/${VERSION}/solana-release/bin/solana-sys-tuner --user root > /root/sys-tuner.log 2>&1
