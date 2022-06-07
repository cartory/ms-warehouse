const { Model, DataTypes } = require('sequelize')

const sequelize = require('../settings/sequelize')

class Recipe extends Model { }
class RecipeIngredient extends Model { }

Recipe.init({
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    name: {
        unique: true,
        type: DataTypes.STRING,
    },
    imageUrl: {
        type: DataTypes.STRING
    },
}, {
    sequelize,
    paranoid: true,
    timestamps: true,
})

RecipeIngredient.init({
    count: {
        defaultValue: 0,
        allowNull: false,
        type: DataTypes.INTEGER,
    }
}, {
    sequelize,
    paranoid: false,
    timestamps: false,
})

module.exports = { Recipe, RecipeIngredient }