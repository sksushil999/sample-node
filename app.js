'use strict'

global.promise = require('bluebird');

const express = require('express');
const logger = require('@open-age/logger')('app')
const serverConfig = require('config').get('webServer');
const redisConfig = require('config').get('queueServer');

const app = express();


require('./settings/database').configure();
require('./settings/express').configure(app);
require('./settings/routes').configure(app);
// require('./helpers/offline').initialize(redisConfig);

app.use((err, req, res, next) => {
    if (err) {
        (res.log || log).error(err.stack);
        if (req.xhr) {
            res.send(500, { error: err });
        } else {
            next(err);
        }
        return;
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

logger.info('environment: ' + process.env.NODE_ENV);
logger.info('starting server');
app.listen(serverConfig.port, () => {
    logger.info('listening on port: ' + serverConfig.port);
})