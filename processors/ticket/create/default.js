'use strict'
const logger = require('@open-age/logger')('processors/ticket/create');
const email = require('../../../helpers/email')


exports.process =(data, context, callback) =>{
    logger.start('process');
    email.sendTicket(data.email, data.txnid, (err) => {
        if(err){
            callback(err);
            logger.error('unable to sent email', err);
        }
        callback();
    });     
}