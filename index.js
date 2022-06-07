require('dotenv').config()

const { io } = require('socket.io-client')

const app = require('./src/app')
const ingredientService = require('./src/services/ingredient.service')

const socket = io(process.env.HOST_MS_RESTAURANT, {
	transports: ['websocket']
})

socket.on("recipe-request", data => {
	const { requestState, recipe } = data

	if (requestState === "preparing") {
		const { ingredients = [] } = recipe

		try {
			ingredients.forEach(async ({ name, count }) => {
				await ingredientService.getIngredientCount(name, count)
			});

			data.requestState = "cooking"
			socket.emit("recipe-response", { ...data, foodReady: true })
		} catch (err) {
			console.error(err);
			data.requestState = "error"
			socket.emit("recipe-response", data)
		}
	}
})

app.listen(() => {
	console.log(new Date())
	console.log(`Server running on \x1b[33mhttp://${process.env.HOST}:${process.env.PORT}\x1b[0m`)
})