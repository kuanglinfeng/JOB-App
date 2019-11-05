
const express = require('express');
const utils  = require('utility')



// 中间件
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const models = require('./model')
const Chat = models.getModel('chat')


// 新建app
const app = express()

// work with express

const server = require('http').Server(app)

const io = require('socket.io')(server)

io.on('connection', (socket) => {
	console.log('user login')
	socket.on('sendmsg', (data) => {
		// console.log(data)
		// io.emit('recvmsg', data)
		const {from, to, msg} = data
		const chatid = [from, to].sort().join('_')
		Chat.create({chatid, from, to, content: msg, create_time: new Date().getTime()}, (err, doc) => {
			io.emit('recvmsg', Object.assign({}, doc._doc))
		})
	})
})

const userRouter = require('./user')

// 这个中间件可以解析cookie
app.use(cookieParser())
// 这个中间件可以解析post过来的json
app.use(bodyParser.json())


// 开启中间件
app.use('/user', userRouter)




server.listen(9093, () => {
	console.log('Node app start at port 9093')
})