// 'use strict';
// var nodemailer = require('nodemailer');
// var mailgunTransport = require('nodemailer-mailgun-transport');
// var emailConfig = require('config').mailgun;
// var logger = require('@open-age/logger')('mailgun');
// var async = require('async');
// var uuid = require('uuid');


// var queue = async.queue(function(params, callback) {
//     var log = logger.start('queueTask');
//     log.debug('sending', params.id);

//     params.transporter.sendMail(params.payload, function(err) {
//         if (err) {
//             log.error('error while sending email', {
//                 id: params.id,
//                 payload: params.payload,
//                 error: err
//             });
//             if (callback) {
//                 callback(err);
//             }
//         } else {
//             log.info('sent email', params.id);
//             if (callback) {
//                 callback(null, 'success');
//             }
//         }
//     });
// }, 1);

// var send = function(emailOptions, transporter, config, callback) {
//     var log = logger.start('send');

//     var id = uuid.v4();

//     log.debug('queuing', {
//         id: id,
//         payload: emailOptions
//     });

//     queue.push({
//         transporter: transporter,
//         payload: emailOptions,
//         id: id
//     }, function (err, data) {
//         if(err){
//             if(callback){
//                 return callback(err);
//             }
//         } else {
//             if(callback){
//                 return callback(null, data);
//             }
//         }
//     });
// };

// var getTransport = function(config) {
//     return nodemailer.createTransport(mailgunTransport({
//         service: 'Mailgun',
//         auth: config.auth
//     }));
// };

// var configuredTrasport = getTransport(emailConfig);


// var mailer = module.exports;

// mailer.config = function(config) {
//     var transport = getTransport(config || emailConfig);

//     return {
//         send: function(email, cb) {
//             send(email, transport, config || emailConfig, cb);
//         }
//     };
// };

// mailer.send = function(email, cb) {
//     send(email, configuredTrasport, emailConfig, cb);
// };