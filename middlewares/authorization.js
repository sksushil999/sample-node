'use strict';
var jwt = require('jsonwebtoken');
var db = global.db;
var authConfig = require('config').get('auth');
var async = require('async');
var bluebird = require('bluebird');
var _ = require('underscore');

var extractToken = (token, req, res, next) => {

    jwt.verify(token, authConfig.secret, {
        ignoreExpiration: true
    }, function(err, claims) {
        if (err) {
            return res.failure('invalid token.');
        }

        db.user.findOne({
                where: { id: claims.user }
            })
            .then(user => {
                if (!user) {
                    throw ('no user found');
                }
                req.user = user;
                next();
            })
            .catch(err => {
                res.failure(err);
            });
    });
};

exports.requiresToken = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({
            success: false,
            message: 'token is required.'
        });
    }

    extractToken(token, req, res, next);
};

exports.requiresTokenOptional = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token)
        return extractToken(token, req, res, next);

    req.user = null;
    next();
};

exports.getToken = user => {

    var claims = {
        user: user.id,
        phone: user.phone
    };

    return jwt.sign(claims, authConfig.secret, {
        expiresIn: authConfig.tokenPeriod || 1440
    });
};

exports.newPin = () => {
    return Math.floor(1000 + Math.random() * 9000);
};