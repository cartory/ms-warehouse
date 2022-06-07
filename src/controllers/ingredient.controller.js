const ingredientService = require('../services/ingredient.service')

const findOne = async ({ params }, res) => {
    const { name } = params

    try {
        const ingredient = await ingredientService.getIngredient(name)
        return res.status(200).json(ingredient?.toJSON() ?? {})
    } catch (err) {
        console.error(err);
        return res.status(500).json({})
    }
}

const findAll = async (_, res) => {
    try {
        const ingredients = await ingredientService.getIngredients()
        return res.status(200).json(ingredients)
    } catch (err) {
        console.error(err)
        return res.status(500).json([])
    }
}

const getIngredientHistory = async ({ query }, res) => {
    let { page = 0, limit = 15 } = query

    page = isNaN(page) ? 0 : Number(page)
    limit = isNaN(limit) ? 15 : Number(limit)

    try {
        const historyRequest = await ingredientService.getIngredientHistory(page, limit)
        return res.status(200).json(historyRequest)
    } catch (err) {
        console.error('error > getIngredientHistory');
        return res.status(500).json([])
    }
}

module.exports = {
    findOne,
    findAll,
    getIngredientHistory,
}
