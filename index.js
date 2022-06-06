require('dotenv').config()

const http = require('http')
const socket = require('socket.io')

const app = require('./src/app')

const server = http.createServer(app)
const io = new socket.Server(server)

const delayInMilliseconds = 500

io.on('connection', (socket) => {
    // 
})

server.listen(process.env.PORT, () => {
	console.log(new Date())
	console.log(`Server running on \x1b[33mhttp://${process.env.HOST}:${process.env.PORT}\x1b[0m`)
})