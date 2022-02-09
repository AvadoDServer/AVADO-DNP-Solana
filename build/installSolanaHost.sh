#!/bin/bash

USERNAME="solana"
VERSION="stable"

# add user
if ! id "${USERNAME}" &>/dev/nulls; then
    echo "Adding user ${USERNAME}"
    adduser --disabled-password --gecos --quiet solana
fi

SOLANA="/home/solana/.local/share/solana/install/active_release/bin/solana"

version () {
    [ -f ${SOLANA} ] && sudo -u ${USERNAME} ${SOLANA} --version
}

if [ ! -f ${SOLANA} -a version ]; then
    sudo -u ${USERNAME} sh -c "wget https://release.solana.com/${VERSION}/install -O - | sh"
fi

version



#VERSION=v1.8.14
#TARFILENAME=solana-release-x86_64-unknown-linux-gnu.tar.bz2
#mkdir -p "/solana/${VERSION}"
#[ -d "/solana/${VERSION}/bin/version.yml" ] && grep --fixed-strings --silent "$VERSION" /solana/${VERSION}/bin/version.yml && echo "already installed" && exit 0
#[ ! -d "/solana/${VERSION}/${TARFILENAME}" ] && wget https://github.com/solana-labs/solana/releases/download/${VERSION}/${TARFILENAME} -O /solana/${VERSION}/${TARFILENAME}
#tar -xjf "/solana/${VERSION}/${TARFILENAME}" --directory /solana/