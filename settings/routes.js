'use strict';

const fs = require('fs');
const apiRoutes = require('../helpers/apiRoute');
const loggerConfig = require('config').get('logger');
var auth = require('../middlewares/authorization');


module.exports.configure = (app) => {

    app.get('/', (req, res) => {
        res.render('index', {
            title: 'Search API'
        });
    });
    app.get('/api', (req, res) => {
        res.render('index', {
            title: 'Search API'
        });
    });

    let api = apiRoutes(app);
    api.model('languages')
        .register([{
            action: 'POST',
            method: 'create'
        }, {
            action: 'GET',
            method: 'get',
            url: '/:id',
        }, {
            action: 'GET',
            method: 'search'
        }, {
            action: 'DELETE',
            method: 'delete',
            url: '/:id',
        }]);

}