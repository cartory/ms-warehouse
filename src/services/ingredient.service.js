const axios = require('axios').default
const { Ingredient } = require('../models/ingredient')


const buyIngredient = async (name) => {
    let quantitySold = 0

    try {
        const res = await axios.get(`${process.env.HOST_FARMER_MARKET}/api/farmers-market/buy?ingredient=${name}`)
        const json = res.data

        quantitySold = json.quantitySold ?? 0
    } catch (err) {
        console.error(err);
    }

    return quantitySold
}

const getIngredientCount = async (name, countRequired = 0) => {
    try {
        const ingredient = await Ingredient.findOne({ where: { name } })

        if (!ingredient) throw new Error('Ingredient Not Found')

        let { stock, minimumStock } = ingredient.toJSON()

        while (stock < minimumStock) {
            const ingredientQuantity = await buyIngredient(name)
            stock = stock + ingredientQuantity
        }

        await ingredient.update({ stock: stock - countRequired })

        return ingredient
    } catch (err) {
        console.error(err);
    }
}

const getIngredients = () => {
    try {
        return Ingredient.findAll()
    } catch (err) {
        console.error(err);
        return []
    }
}

const getIngredient = async (name = "") => {
    name = name.toLowerCase()

    try {
        return Ingredient.findOne({ where: { name } })
    } catch (err) {
        console.error(err);
        throw new Error('Ingredient Not Found')
    }
}

module.exports = {
    buyIngredient,
    getIngredientCount,

    getIngredient,
    getIngredients,
}
