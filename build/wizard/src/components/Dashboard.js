import React from "react";
import axios from "axios";
import autobahn from "autobahn-browser";

const Comp = () => {
    const [wampSession, setWampSession] = React.useState();

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

    const test = async () => {
        const command = '/home/solana/.local/share/solana/install/active_release/bin/solana --version';
        await axios.post(`http://solana.my.ava.do:9999/test`, { command: command }, { timeout: 5 * 60 * 1000 }).then((res) => {
            console.log(`test ${command}: ` + res.data);
            alert(res.data)
        })
    }


    return (
        <div className="dashboard has-text-white">
            {!wampSession && (
                <p>Avado Connection problem. Check your browser's console log for more details.</p>
            )}

            <section className="has-text-white">
                <div className="columns is-mobile">
                    <div className="column">

                        <div className="field">
                            <button className="button" onClick={test}>Test</button>
                        </div>

                    </div>
                </div>
            </section>

        </div>

    )
}


export default Comp;