const { Request } = require('../models/request')
const { Ingredient } = require('../models/ingredient')
const { Recipe, RecipeIngredient } = require('../models/recipe')

Ingredient.belongsToMany(Recipe, { through: RecipeIngredient, as: 'recipes' })
Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, as: 'ingredients' })

Request.belongsTo(Recipe, { as: 'recipe' })
Request.belongsTo(Ingredient, { as: 'ingredient' })

module.exports = {
    Recipe,
    Request,
    Ingredient,
    RecipeIngredient,
}