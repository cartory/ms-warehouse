require('dotenv').config()

const http = require('http')
const socket = require('socket.io')

const app = require('./src/app')

const server = http.createServer(app)
const io = new socket.Server(server)

const ingredientService = require('./src/services/ingredient.service')

io.on('connection', (socket) => {
	console.log('connection', socket.id)
	
	socket.on('recipe-request', data => {
		const { clientId, requestState, recipe } = data

		if (requestState === "preparing-recipe") {
			const { ingredients = [] } = recipe

			try {
				ingredients.forEach(async ({ name, count }) => {
					console.log("getting " + name, count);
					await ingredientService.getIngredientCount(name, count)
				});

				data.requestState = "cooking-recipe"
				socket.broadcast.to(clientId).emit('recipe-request', data)
			} catch (err) {
				console.error(err);
				data.requestState = "error-recipe"
				socket.broadcast.to(clientId).emit('recipe-request')
			}
		}
	})
})

server.listen(process.env.PORT, () => {
	console.log(new Date())
	console.log(`Server running on \x1b[33mhttp://${process.env.HOST}:${process.env.PORT}\x1b[0m`)
})