const express = require('express');
const http = require('http');
const router = require('./src/Routes/Auth');
const port = require('./src/Config/port');
const C_CheckTimeInOut = require('./src/Contorllers/Contorllers.CheckTimeInOut');

let httpServer;
startup = async () => {
    console.log('INFO : Starting service...');
    try {
        console.log('INFO : Initializing service module...');
        await initialize();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    try {
        await C_CheckTimeInOut.ChecktimeInOut();
    } catch (err) {
        console.err(err);
    }

    console.log('INFO : Starting loading data timeinout...');

}
startup();

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            next();
        });
        app.get("/", (req, res) => {
            res.end('Hello World!');
        });

        app.use('/api', router);
        httpServer.listen(port.port).on('listening', () => {
            console.log(`INFO : Web server listening on localhost:${port.port}`);
            resolve();
        }).on('error', err => {
            reject(err);
        });
    });

}
close = () => {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}