const restify = require("restify");
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

const network = process.env.NETWORK; // either "prater" or "mainnet"

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

server.post("/test", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        rpd(req.body.command).then((stdout) => {
            res.send(200, stdout);
            return next();
        }).catch((e) => {
            res.send(500, e);
            return next();
        })
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

const rpd = (command) => {
    const cmd = `docker run --rm --privileged  --net=host --pid=host --ipc=host --volume /:/host  busybox  chroot /host ${command}`;
    console.log(`Running ${cmd}`);
    
    const executionPromise = execute(cmd);

    return executionPromise;
}


server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
