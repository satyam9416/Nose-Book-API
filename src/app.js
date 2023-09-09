// I M P O R T S
import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import http from 'http'

// D E C L A R A T I O N S
const app = express()
const PORT = process.env.PORT
const server = http.createServer(app)

const io = new Server(server)

// R O U T E S
import authRouter from './Routes/auth-route.js'
import userRouter from './Routes/user-route.js'
import postRouter from './Routes/post-route.js'
import chatsRouter from './Routes/chat-route.js'
import authMiddleware from './middlewares/auth.js'

// M I D D L E  W A R E S
app.use(express.static('public'))
app.use('/images', express.static('images'))
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

// R O U T E S  S E T U P 
app.use('/auth', authRouter)
app.use('/user', authMiddleware ,userRouter)
app.use('/post', authMiddleware ,postRouter)
app.use('/chats', authMiddleware ,chatsRouter)

// SOCKET.IO
let users = [];

io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
        const newUser = { userId, socketId: socket.id }
        if (!users.some((user) => user.userId === userId)) {
            users.push(newUser)
        }
        else {
            users = users.map((user) => {
                if (user.userId === newUser.userId) {
                    return { ...user, socketId: socket.id }
                } else {
                    return user
                }
            })
        }
    })
    socket.on('msgSent', newMsg => {
        const user = users.find((user) => user.userId === newMsg.recieverId)
        user && io.to(user.socketId).emit('recieveMsg', newMsg)
    })

    socket.on('disconnect', () => {
        users = users.filter((user) => user.socketId !== socket.id)
    })
})

// E S T A B L I S H I N G  C O N N E C T I O N
mongoose.connect(process.env.MONGO_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        server.listen(PORT, process.env.HOSTNAME, () => console.log(`Server started and listening at http://${process.env.HOSTNAME}:${PORT}`))
    }).catch((err) => console.log(`Error : ${err}`))
