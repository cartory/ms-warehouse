const cors = require('cors')
const morgan = require('morgan')
const express = require('express')

const apiRoutes = require('./api.routes')
const sequelize = require('./settings/sequelize')

const app = express()

sequelize
    .authenticate()
    .then(() => console.log('auth done'))
    .catch(e => console.error('auth error'))

app
    .use(cors())
    .use(morgan('dev'))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use('/api', apiRoutes)
    .get('/', (_, res) => res.send('<h1>Welcome to ms-ware-house API 👋 </h1>'))

module.exports = app