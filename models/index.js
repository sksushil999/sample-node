'use strict';
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const lodash = require('lodash');

let initModels = () => {
    let db = {};
    fs.readdirSync(__dirname)
        .filter((file) => {
            return (file.indexOf('.') !== 0) && (file !== basename);
        })
        .forEach((file) => {
            let model = sequelize['import'](path.join(__dirname, file));
            db[model.name] = model;
        });



    // db.user.hasMany(db.device);
    // db.device.belongsTo(db.user);

    // db.user.hasMany(db.postLike);
    // db.postLike.belongsTo(db.user);

    // db.post.hasMany(db.postLike);
    // db.postLike.belongsTo(db.post);

    // db.user.hasMany(db.postFavourite);
    // db.postFavourite.belongsTo(db.user);

    // db.post.hasMany(db.postFavourite);
    // db.postFavourite.belongsTo(db.post);

    // db.user.hasMany(db.post);
    // db.post.belongsTo(db.user);

    // db.user.hasMany(db.postComment);
    // db.postComment.belongsTo(db.user);

    // db.post.hasMany(db.postComment);
    // db.postComment.belongsTo(db.post);

    // db.user.hasMany(db.postRating);
    // db.postRating.belongsTo(db.user);

    // db.post.hasMany(db.postRating);
    // db.postRating.belongsTo(db.post);

    // db.user.hasMany(db.report);
    // db.report.belongsTo(db.user);

    // db.language.hasMany(db.commentContent);
    // db.commentContent.belongsTo(db.language);

    Object.keys(db).forEach((modelName) => {
        if ('associate' in db[modelName]) {
            db[modelName].associate(db);
        }
    });
    return db;
};


module.exports = initModels();