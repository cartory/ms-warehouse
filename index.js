require('dotenv').config()

const http = require('http')
const socket = require('socket.io')

const app = require('./src/app')

const server = http.createServer(app)
const io = new socket.Server(server)

const ingredientService = require('./src/services/ingredient.service')

io.on('connection', (socket) => {
	socket.on('recipe-request', async data => {
		const { clientId, requestState, recipe } = data

		await socket.join(clientId)
		
		if (requestState === "preparing-recipe") {
			const { ingredients = [] } = recipe

			try {
				ingredients.forEach(async ({ name, count }) => {
					await ingredientService.getIngredientCount(name, count)
				});

				data.requestState = "cooking-recipe"
				io.sockets.in(clientId).emit("recipe-response", data)
			} catch (err) {
				console.error(err);
				data.requestState = "error-recipe"
				io.sockets.in(clientId).emit("recipe-response")
			}
		}
	})
})

server.listen(process.env.PORT, () => {
	console.log(new Date())
	console.log(`Server running on \x1b[33mhttp://${process.env.HOST}:${process.env.PORT}\x1b[0m`)
})