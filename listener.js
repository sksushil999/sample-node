'use strict';
global.Promise = require('bluebird');
const logger = require('@open-age/logger')('listener');
require('./settings/database').configure();
require('./helpers/offline').listen();

logger.info('listener procced')