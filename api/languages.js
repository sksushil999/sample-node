'use strict';
const async = require('async');
let mapper = require('../mappers/language');



exports.create = (req, res) => {

    let name = req.body.name;
    let code = req.body.code;

    if (!req.body.name || !req.body.code)
        return res.failure('name or code missing');

    async.waterfall([

        (cb) => {
            db.language.build({
                name: req.body.name,
                code: req.body.code,
            })
                .save()
                .then((language) => {
                    cb(null, language);
                })
                .catch(err => {
                    return cb(err);
                });
        }
    ], (err, language) => {
        if (err)
            return res.failure(err);
        return res.data(mapper.toModel(language));
    });


};


exports.search = (req, res) => {

    let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
    let serverPaging = req.query.serverPaging == "false" ? false : true;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    let offset = pageSize * (pageNo - 1);
    let totalRecords = 0;

    let query = {
        order: [
            ['id', 'DESC']
        ]
    };

    if (serverPaging) {
        query.limit = pageSize;
        query.offset = offset;
    }

    let where = {};
    if (req.query.code) {
        where.code = {
            $like: '%' + req.query.code + '%'
        };
    }

    if (req.query.lastModifiedDate) {
        where.updatedAt = {
            $gte: Date.parse(req.query.lastModifiedDate)
        };
    }
    query.where = where;
    db.language.findAll(query).then(language => {
        db.language.findAndCountAll({ where: where }).then(result => {
            return res.page(mapper.toSearchModel(language), pageNo, pageSize, result.count);
        })
            .catch(err => {
                res.failure(err);
            });
    })
        .catch(err => {
            res.failure(err);
        });
};

exports.get = (req, res) => {
    db.language.find({
        where: { id: req.params.id }
    })
        .then((language) => {
            if (!language) return res.failure('no language found');
            return res.data(mapper.toModel(language));
        })
        .catch((err) => res.failure(err))

};

exports.delete = (req, res) => {
    db.language.find({
        where: { id: req.params.id }
    }).then(language => {
        if (!language) return res.failure(`language not found`);
        language.destroy().then(() => {
            return res.success('language deleted successfully ');
        }).catch(err => res.failure(err))
    }).catch(err => res.failure(err))
};

