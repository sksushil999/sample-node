'use strict';
module.exports = () => {
    var language = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
        code: { type: Sequelize.STRING, allowNull: false, unique: true },
    };

    return sequelize.define('language', language);
};