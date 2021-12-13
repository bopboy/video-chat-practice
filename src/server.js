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

const publicRooms = () => {
    const { sockets: { adapter: { sids, rooms } } } = wsServer
    const publicRooms = []
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) { publicRooms.push(key) }
    })
    return publicRooms
}
const countRoom = (roomName) => {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size
}

wsServer.on('connection', (socket) => {
    socket["nickname"] = "Anonymous"
    socket.onAny(event => {
        console.log(wsServer.sockets.adapter)
        console.log(`socket event: ${event}`)
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName)
        done()
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName))
        wsServer.sockets.emit("room_change", publicRooms())
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1))
    })
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms())
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`)
        done()
    })
    socket.on("nickname", (nickname) => {
        socket["nickname"] = nickname
    })
})
