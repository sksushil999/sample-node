'use strict';
const logger = require('@open-age/logger')('providers.qrImage');
const qrImage = require('qr-image');
const fs = require('fs');


exports.create = function (qrString, options, callback) {
    logger.start('create');
    const fileName = options.path;

    const qrcode = qrImage.image(qrString, { type: 'png' });
    const output = fs.createWriteStream(fileName);
    qrcode.pipe(output);
    output.on('finish',  (err) => {
        if (err) {
            logger.error(err);
        }
        callback(err);
    });
};
