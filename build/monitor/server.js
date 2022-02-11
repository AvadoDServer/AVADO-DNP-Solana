const restify = require("restify");
const errors = require('restify-errors');
const corsMiddleware = require("restify-cors-middleware2");

const exec = require("child_process").exec;
const fs = require('fs');

console.log("Monitor starting...");

const server = restify.createServer({
    name: "MONITOR",
    version: "1.0.0"
});

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: [
        /^http:\/\/localhost(:[\d]+)?$/,
        "http://*.dappnode.eth",
        "http://*.my.ava.do"
    ]
});

const solanaBaseDir = "/home/solana/.local/share/solana/install/active_release/bin/";

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

server.post("/test", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        runOnHost(req.body.command).then((stdout) => {
            res.send(200, stdout);
            return next();
        }).catch((e) => {
            res.send(500, e);
            return next();
        })
    }
});

server.get("/version", (req, res, next) => {
    try {
        runOnHost(`${solanaBaseDir}/solana --version`)
            .then((stdout) => {
                const versionRegex = /solana-cli (?<version>\d+\.\d+\.\d+) \(.*\)/g;
                const regexResult = versionRegex.exec(stdout);
                if (regexResult) {
                    res.send(200, regexResult.groups.version);
                    next();
                }
                else
                    return next(new errors.InternalServerError('Something went wrong1'));
            })
            .catch((error) => {
                return next(new errors.InternalServerError(error))
            });
    } catch (error) {
        return next(new errors.InternalServerError('Something went wrong'));
    }
});

const execute = (cmd) => {
    return new Promise((resolve, reject) => {
        const child = exec(cmd, (error, stdout, stderr) => {
            const debug = false;

            if (error) {
                console.log(`error: ${error.message}`);
                return reject(error.message);
            }
            if (stderr) {
                console.log(`error: ${stderr}`);
                return reject(stderr);
            }
            return resolve(stdout);

        });
        child.stdout.on('data', (data) => console.log(data.toString()));
    });
}

const runOnHost = (command) => {
    const cmd = `docker run --rm --privileged  --net=host --pid=host --ipc=host --volume /:/host  busybox  chroot /host sudo -u solana sh -c "${command}"`;
    console.log(`Running ${cmd}`);
    const executionPromise = execute(cmd);
    return executionPromise;
}


server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
