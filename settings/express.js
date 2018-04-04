'use strict';

const express = require('express');
const logger = require('@open-age/logger')('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


module.exports.configure = (app) => {
    const log = logger.start('config');
    const root = path.normalize(__dirname + './../');

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser({ limit: '50mb', keepExtensions: true }));
    app.set('views', path.join(root, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(root, 'public')));

};