require('dotenv').config()

const { io } = require('socket.io-client')

const app = require('./src/app')
const ingredientService = require('./src/services/ingredient.service')

const socket = io('ws://localhost:3000', {
	transports: ['websocket']
})

socket.on("recipe-request", data => {
	const { clientId, requestState, recipe } = data

	await socket.join(clientId)

	if (requestState === "preparing-recipe") {
		const { ingredients = [] } = recipe

		try {
			ingredients.forEach(async ({ name, count }) => {
				await ingredientService.getIngredientCount(name, count)
			});

			data.requestState = "cooking-recipe"
			socket.emit("recipe-response", data)
		} catch (err) {
			console.error(err);
			data.requestState = "error-recipe"
			socket.emit("recipe-response", data)
		}
	}
})

app.listen(() => {
	console.log(new Date())
	console.log(`Server running on \x1b[33mhttp://${process.env.HOST}:${process.env.PORT}\x1b[0m`)
})