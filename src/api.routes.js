const { Router } = require('express')

const ingredientController = require('./controllers/ingredient.controller')

const router = Router()

router
    .get('/ingredients', ingredientController.findAll)
    .get('/ingredients/:name', ingredientController.findOne)
    .get('/history/market', ingredientController.getIngredientHistory)

module.exports = router