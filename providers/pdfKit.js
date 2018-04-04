'use strict';
const fs = require('fs');
const path = require('path');
const PDF = require('pdfkit');
const _ = require('underscore');
const async = require('async');
const moment = require('moment');
const logger = require('@open-age/logger')('providers/pdfKit');
const qrImage = require('./qrImage');

exports.create = (visitors, callback) => {
    logger.start('createPdf');
    async.waterfall([  
        (cb) =>{
            async.each(visitors, (visitor, next) => {
                qrImage.create(
                   visitor.qrString
                , {
                    path: 'QRCode/' + visitor.ticketNo + '.png',                   
                    type: 'csv'
                }, next);
            }, (err) => {
                cb(err);
            });
        }, 
        (cb) => {
            const fileName = 'tickets/' + visitors[0].paymentNo + '.pdf';
            let doc = new PDF();
            const output = fs.createWriteStream(fileName);
            doc.pipe(output);
            let isFirstPage = true;

            _.each(visitors, (visitor, index) => {
                if (index === 0) {
                    isFirstPage = false;
                } else {
                    doc.addPage();
                }
                doc.rect(10, 10, 590, 770).stroke();
                doc.image('public/images/pdf/images/MIC.png', 20, 20, { width: 250, height: 60, align: 'left' });
                doc.image('public/images/pdf/images/ASIlogo.jpg', 300, 20, { width: 260, height: 50, align: 'right' });
                doc.registerFont('Heading Font', 'public/images/pdf/font/bold.ttf');
                doc.registerFont('Regular Font', 'public/images/pdf/font/light.ttf');

                doc.fontSize(15).font('Heading Font').text('E-Ticket for ' + visitor.Monument.name, 100, 80, {
                    align: 'center'
                });
                doc.fontSize(10).font('Regular Font').text('Ticket is valid for one person and one time use only', 100, 95, {
                    align: 'center'
                });
                if(visitor.Monument.comment) {
                    doc.fontSize(10).font('Regular Font').text(visitor.Monument.comment, 100,115, {
                    align: 'center'
                    });
                }


                doc.moveTo(30, 130).lineTo(580, 130).stroke();
                doc.fontSize(12).font('Heading Font').text('Visitor Name', 30, 140);
                doc.fontSize(12).font('Regular Font').text(visitor.name, 110, 140).moveDown();
                doc.fontSize(12).font('Heading Font').text('Ticket Type', 30, 160);
                doc.fontSize(12).font('Regular Font').text(visitor.isAdult ? 'Adult' : 'Children', 110, 160).moveDown();
                doc.fontSize(12).font('Heading Font').text('Age', 30, 180);
                doc.fontSize(12).font('Regular Font').text(visitor.age, 110, 180).moveDown();
                doc.fontSize(12).font('Heading Font').text('Visitor Type', 30, 200);
                doc.fontSize(12).font('Regular Font').text(visitor.Nationality.name, 110, 200).moveDown();
                doc.fontSize(12).font('Heading Font').text('ID Type', 30, 220);
                doc.fontSize(12).font('Regular Font').text(visitor.IdentityType.name, 110, 220).moveDown();
                doc.fontSize(12).font('Heading Font').text('Ticket No', 30, 240);
                doc.fontSize(12).font('Regular Font').text(visitor.ticketNo, 110, 240).moveDown();

                doc.fontSize(12).font('Heading Font').text('Gender', 300, 180);
                doc.fontSize(12).font('Regular Font').text(visitor.gender, 360, 180).moveDown();
                doc.fontSize(12).font('Heading Font').text('Country', 300, 200);
                doc.fontSize(12).font('Regular Font').text(visitor.Country.name, 360, 200).moveDown();
                doc.fontSize(12).font('Heading Font').text('ID No', 300, 220);
                doc.fontSize(12).font('Regular Font').text(visitor.identityNo, 360, 220).moveDown();
                if (visitor.isAdult) {
                    if (visitor.Monument.code === 'TAJ') {
                        doc.fontSize(12).font('Heading Font').text('ASI Fee ', 300, 240);
                        doc.fontSize(12).font('Regular Font').text('Rs. ' + visitor.AmountConfiguration.part1, 360, 240).moveDown();
                        doc.fontSize(12).font('Heading Font').text('ADA Tax', 300, 260);
                        doc.fontSize(12).font('Regular Font').text('Rs. ' + visitor.AmountConfiguration.part2, 360, 260).moveDown();
                    } else {
                        doc.fontSize(12).font('Heading Font').text('Entry Fee', 300, 240);
                        doc.fontSize(12).font('Regular Font').text('Rs. ' + visitor.amount, 360, 240).moveDown();
                    }
                } else {
                    doc.fontSize(12).font('Heading Font').text('Entry Fee', 300, 240);
                    doc.fontSize(12).font('Regular Font').text('Rs. ' + visitor.amount, 360, 240).moveDown();
                }

                doc.image('QRCode/' + visitor.ticketNo + '.png', 440, 135, { width: 140, height: 140, align: 'right' });

                doc.moveTo(30, 280).lineTo(580, 280).stroke();
                doc.fontSize(12).font('Heading Font').text('Valid From  ' + moment(visitor.validFrom).format('YYYY-MM-DD') + ' To ' + moment(visitor.validTill).format('YYYY-MM-DD'), 300, 300, {
                    align: 'right'
                });
                doc.moveTo(30, 350).lineTo(580, 350).stroke();

                doc.moveTo(300, 350).lineTo(300, 770).stroke();

                doc.fontSize(16).text('Important Information', 30, 370);
                doc.fontSize(12).text('1) The e-ticket is not transferable.', 30, 420, { width: 250 });
                doc.fontSize(12).text('2) Entry Fee is not refundable.', 30, 440, { width: 250 });
                doc.fontSize(12).text('3) E-ticket cancellations are not permitted.', 30, 460, { width: 250 });
                doc.fontSize(12).text('4) The Monument is open for visitors between sunrise and sunset.', 30, 480, { width: 250 });
                doc.fontSize(12).text('5) Visitor shall be required to show photo identity proof in original at the entry to the monument.', 30, 510, { width: 250 });
                doc.fontSize(12).text('6) Edibles are not allowed inside the monument.', 30, 550, { width: 250 });
                doc.fontSize(12).text('7) Inflammable/dangerous/explosive articles are not allowed.', 30, 570, { width: 250 });
                doc.image('public/images/form/canara_bank.png', 320, 400, { width: 250, height: 40, align: 'right' });
                doc.image('public/images/pdf/images/clean.png', 350, 650, { width: 250, height: 140, align: 'right' });
            });

            doc.end();
            output.on('finish', () => {
                logger.info('ticket pdf created');
                cb(null);
            });
        },
        (cb) => {
            async.each(visitors, (visitor, next) => {
                visitor.ticketStatus = 'Printed';
                visitor.save()
                    .then(() =>{
                        next();
                    }).catch((err)=> {
                        next(err);
                    });
            }, (err) =>{
                cb(err, visitors);
            });
        }
        // todo delete qr codes
    ], (err) => {
        if (err) {
            return callback(err);
        }
        callback(null, path.join('tickets/', visitors[0].paymentNo + '.pdf'));
    });
};