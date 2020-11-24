const process = require('process');
const fs = require('fs');
const { Console } = require('console');

const serverout = fs.createWriteStream('./serverout.log');
const servererr = fs.createWriteStream('./servererr.log');
const logger = new Console({ stdout: serverout, stderr: servererr });
const now = new Date(Date.now());
logger.log("Server up at " + now);
logger.log("Process ID: " + process.pid);
process.send({ type: "SERVER_UP" });

process.on('message', message => {
    if (message === 'run-test') {
        const { simpleParser } = require('mailparser');
        const source = `Content-Type: text/plain; charset=utf-8
Subject: Test subject
Test mail`;
        simpleParser(source, {}, (err, mail) => {
            process.send({ type: "TEST_RESULTS", data: mail });
			logger.log('Test successfully run, mail=')
            logger.log(mail);
        });
    }
});