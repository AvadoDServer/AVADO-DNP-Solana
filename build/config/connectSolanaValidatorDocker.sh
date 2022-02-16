#!/bin/bash

#copy install scrip to host
docker run --rm --privileged  --net=host --pid=host --ipc=host --volume /:/host  busybox  chroot /host docker cp DAppNodePackage-solana.avado.dnp.dappnode.eth:/root/connectSolanaValidatorHost.sh /root/

#execute script
docker run --rm --privileged  --net=host --pid=host --ipc=host --volume /:/host  busybox  chroot /host sh -c "/root/connectSolanaValidatorHost.sh ${SOLANA_VERSION} ${SOLANA_CLUSTER} ${EXTRA_OPTS}"