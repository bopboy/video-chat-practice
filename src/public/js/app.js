const socket = io()

const welcome = document.querySelector("#welcome")
const form = welcome.querySelector("form")
const room = document.querySelector('#room')
room.hidden = true

let roomName
const handleMessageSubmit = (event) => {
    event.preventDefault()
    const input = room.querySelector("#msg input")
    const value = input.value
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`)
    })
    input.value = ""
}
const handleNicknameSubmit = (event) => {
    event.preventDefault()
    const input = room.querySelector("#name input")
    socket.emit("nickname", input.value)
}
const showRoom = () => {
    welcome.hidden = true
    room.hidden = false
    const h3 = room.querySelector('h3')
    h3.innerText = `Room: ${roomName}`
    const msgForm = room.querySelector("#msg")
    msgForm.addEventListener("submit", handleMessageSubmit)
    const nameForm = room.querySelector("#name")
    nameForm.addEventListener("submit", handleNicknameSubmit)
}
form.addEventListener("submit", (event) => {
    event.preventDefault()
    const input = form.querySelector("input")
    roomName = input.value
    socket.emit("enter_room", roomName, showRoom)
    input.value = ""
})

const addMessage = (msg) => {
    const ul = room.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = msg
    ul.appendChild(li)
}

socket.on("welcome", (user, count) => {
    const h3 = room.querySelector("h3")
    h3.innerText = `Room ${roomName}  (${count})`
    addMessage(`${user} Joined 😀`)
})
socket.on("new_message", addMessage)
socket.on("bye", (user, count) => {
    const h3 = room.querySelector("h3")
    h3.innerText = `Room ${roomName}  (${count})`
    addMessage(`${user} left 🙁`)
})
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul")
    roomList.innerHTML = ""
    if (rooms.length === 0) {
        roomList.innerHTML = ""
        return
    }
    rooms.forEach((room) => {
        const li = document.createElement("li")
        li.innerText = room
        roomList.append(li)
    })
})