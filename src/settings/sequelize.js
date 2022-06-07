const { Sequelize } = require('sequelize')

module.exports = new Sequelize(
    process.env.DATABASE_URL,
    {
        logging: true,
        define: {
            paranoid: true,
            defaultScope: {
                attributes: {
                    exclude: [
                        'createdAt', 'updatedAt', 'deletedAt'
                    ]
                }
            }
        },
        pool: {
            idle: 10000,
            acquire: 3600000,
        },
    }
)