require('dotenv').config()

const { io } = require('socket.io-client')

const app = require('./src/app')
const ingredientService = require('./src/services/ingredient.service')

const delayInMilliseconds = 3000

const socket = io(process.env.HOST_MS_RESTAURANT, {
	transports: ['websocket']
})

socket.on("recipe-request", data => {
	const { requestState, recipe } = data

	if (requestState === "prepare") {
		console.log(data);
		const { ingredients = [] } = recipe

		try {
			ingredients.forEach(async ({ name, count }) => {
				await ingredientService.getIngredientCount(name, count)
			});

			data.foodReady = true
			data.requestState = "ready"

			setTimeout(() => {
				socket.emit("recipe-response", data)
			}, delayInMilliseconds);
		} catch (err) {
			console.error(err);
			data.requestState = "error"

			setTimeout(() => {
				socket.emit("recipe-response", data)
			}, delayInMilliseconds);
		}
	}
})

app.listen(process.env.PORT || 6000, () => {
	console.log(new Date(), process.env.PORT)
	console.log(`Server running on \x1b[33mhttp://${process.env.HOST}:${process.env.PORT}\x1b[0m`)
})