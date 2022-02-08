Links

* Installation instructions: https://docs.solana.com/cli/install-solana-cli-tools
* License: Apache 2.0: https://github.com/solana-labs/solana/blob/master/LICENSE

latests release:
   52  wget https://github.com/solana-labs/solana/releases/download/v1.8.14/solana-release-x86_64-unknown-linux-gnu.tar.bz2
   53  wget https://github.com/solana-labs/solana/releases/download/v1.8.14/solana-install-init-x86_64-unknown-linux-gnu


Install via script:
```
sh -c "$(curl -sSfL https://release.solana.com/v1.8.14/install)"
```
This downloads and runs https://github.com/solana-labs/solana/blob/master/install/solana-install-init.sh

Manual install:
```
wget https://github.com/solana-labs/solana/releases/download/v1.8.14/solana-release-x86_64-unknown-linux-gnu.tar.bz2
tar jxf solana-release-x86_64-unknown-linux-gnu.tar.bz2
cd solana-release/
export PATH=$PWD/bin:$PATH
```