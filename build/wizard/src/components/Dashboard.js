import React from "react";
import axios from "axios";
import autobahn from "autobahn-browser";

const Comp = () => {
    const [wampSession, setWampSession] = React.useState();
    const [version, setVersion] = React.useState();
    const [installed, setInstalled] = React.useState(false);
    const [uploadValidatorKeyPairResult, setUploadValidatorKeyPairResult] = React.useState();
    const [uploadVoteAccountKeyPairResult, setUploadVoteAccountKeyPairResult] = React.useState();
    
    const monitor = "http://solana.my.ava.do:9999";

    React.useEffect(() => {
        const url = "ws://wamp.my.ava.do:8080/ws";
        const realm = "dappnode_admin";
        const connection = new autobahn.Connection({
            url,
            realm
        });
        connection.onopen = session => {
            console.debug("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
            setWampSession(session);
        };
        // connection closed, lost or unable to connect
        connection.onclose = (reason, details) => {
            this.setState({ connectedToDAppNode: false });
            console.error("CONNECTION_CLOSE", { reason, details });
        };
        connection.open();
    }, []);

    React.useEffect(() => {
        updateVersion()
        if (version) {
            setInstalled(true);
            return;
        }

        const interval = setInterval(() => {
            updateVersion()
            if (version) {
                setInstalled(true)
                clearInterval(interval);
            }
        }, 10 * 1000); // 10 seconds refresh

        return () => clearInterval(interval);
    }, [version]);

    const test = async () => {
        const command = '/home/solana/.local/share/solana/install/active_release/bin/solana --version';
        await axios.post(`${monitor}/test`, { command: command }, { timeout: 5 * 60 * 1000 }).then((res) => {
            console.log(`test ${command}: ` + res.data);
            alert(res.data)
        })
    }

    const updateVersion = async () => {
        console.log('checking version')
        await axios.get(`${monitor}/version`)
            .then((res) => setVersion(res.data))
            .catch(error => console.log(error))
    }

    const regextest = () => {
        const test = "solana-cli 1.8.15 (src:4ce59bbb; feat:1886190546)";
        console.log(test);
        const versionRegex = /solana-cli (?<version>\d+\.\d+\.\d+) \(.*\)/g;
        const foo = versionRegex.exec(test);
        console.dir(foo);
        if (foo)
            return foo.groups.version
        return null;
    }

    async function uploadFile(file, expecteFileName, setMsg) {
        if (file.name !== expecteFileName) {
            setMsg("Expected file name " + expecteFileName)
            return;
        }
        const data = new FormData();
        data.append('file', file);
        axios.post(`${monitor}/upload`, data).then(res => {
            //TODO Error handling
            // console.log(res);
            setMsg(res.data.message);
        }).catch(err => {
            console.log(err);
        });
    }


    return (
        <div className="dashboard has-text-white">
            {!wampSession && (
                <p>Avado Connection problem. Check your browser's console log for more details.</p>
            )}

            {!installed && (
                <div>
                    <p>Solana is not installed yet. Please wait for the installer to finish.</p>
                    <p>Installation time depends on your network speed and can take a few minutes.</p>
                </div>
            )}

            <section className="has-text-white">
                <div className="columns is-mobile">
                    <div className="column">

                        <div className="field">
                            <button className="button" onClick={test}>Test</button>
                        </div>
                        <p>Using Solana {version}</p>

                        <div>
                            validator-keypair.json (<a href="https://docs.solana.com/running-validator/validator-start#generate-identity">doc</a>)&nbsp;
                            <input
                                type="file"
                                onChange={e => uploadFile(e.target.files[0], "validator-keypair.json", setUploadValidatorKeyPairResult)}
                            />
                            {uploadValidatorKeyPairResult && (<div className="is-size-7">{uploadValidatorKeyPairResult}</div>)}
                        </div>

                        <div>
                            vote-account-keypair.json (<a href="https://docs.solana.com/running-validator/validator-start#create-vote-account">doc</a>)&nbsp;
                            <input
                                type="file"
                                onChange={e => uploadFile(e.target.files[0], "vote-account-keypair.json", setUploadVoteAccountKeyPairResult)}
                            />
                            {uploadVoteAccountKeyPairResult && (<div className="is-size-7">{uploadVoteAccountKeyPairResult}</div>)}
                        </div>




                    </div>
                </div>
            </section>

        </div>

    )
}


export default Comp;