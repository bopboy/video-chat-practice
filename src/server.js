import express from 'express'
import http from 'http'
// import WebSocket from 'ws'
import SocketIO from 'socket.io'

const app = express()

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"))
app.get("/*", (req, res) => res.redirect("/"))

const httpServer = http.createServer(app)
const wsServer = SocketIO(httpServer)

httpServer.listen(3000, () => {
    console.log(`Listening on http://localhost:3000`)
})

const sockets = []
wsServer.on('connection', (socket) => {
    socket.onAny(event => console.log(`socket event: ${event}`))
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName)
        done()
        socket.to(roomName).emit("welcome")
    })
})
