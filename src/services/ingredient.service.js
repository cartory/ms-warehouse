const { Op } = require('sequelize')

const axios = require('axios').default

const { Ingredient, Request } = require('../settings/models')

const buyIngredient = async (name) => {
    let quantitySold = 0

    try {
        const res = await axios.get(`${process.env.HOST_MS_MARKET}/api/farmers-market/buy?ingredient=${name}`)
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

            if (ingredientQuantity !== 0) {
                try {
                    await Request.create({
                        ingredientId: ingredient.getDataValue('id')
                    })

                } catch (err) {
                    console.error('error > getIngredientCount > request.create');
                }
            }

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

const getIngredient = (name = "") => {
    name = name.toLowerCase()

    try {
        return Ingredient.findOne({ where: { name } })
    } catch (err) {
        throw new Error('Ingredient Not Found')
    }
}

const getIngredientHistory = (page = 0, limit = 10) => {
    try {
        return Request.findAll({
            limit: limit,
            offset: limit * page,
            where: {
                IngredientId: {
                    [Op.not]: null
                }
            },
            include: ['ingredient']
        })
    } catch (err) {
        throw new Error('Ingredients History Error')
    }
}

module.exports = {
    getIngredient,
    getIngredients,
    getIngredientCount,
    getIngredientHistory,
}

