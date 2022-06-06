const cors = require('cors')
const express = require('express')

const apiRoutes = require('./api.routes')
const { Ingredient } = require('./models/ingredient')

const app = express()
const sequelize = Ingredient.sequelize
const ingredients = require('./models/ingredients.json')

sequelize
    .sync()
    .then(() => {
        console.log('sync done')
        Ingredient.bulkCreate(ingredients).finally()
    })
    .catch(e => console.error('sync error'))

app
    .use(cors())
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use('/api', apiRoutes)
    .get('/', (_, res) => res.send('<h1>Welcome to ms-ware-house API 👋 </h1>'))

module.exports = app