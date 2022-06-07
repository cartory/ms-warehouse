const { Model, DataTypes } = require('sequelize')

const sequelize = require('../settings/sequelize')

class Request extends Model { }

Request.init({
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
}, {
    sequelize,
    paranoid: false,
    timestamps: true,
    defaultScope: {
        attributes: {
            exclude: ['deletedAt'],
            include: ['createdAt', 'updatedAt'],
        },
    }
})

module.exports = { Request }