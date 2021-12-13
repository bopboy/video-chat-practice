const socket = io()

const welcome = document.querySelector("#welcome")
const form = welcome.querySelector("form")
const room = document.querySelector('#room')
room.hidden = true

let roomName
const handleMessageSubmit = (event) => {
    event.preventDefault()
    const input = room.querySelector("input")
    const value = input.value
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`)
    })
    input.value = ""
}
const showRoom = () => {
    welcome.hidden = true
    room.hidden = false
    const h3 = room.querySelector('h3')
    h3.innerText = `Room: ${roomName}`
    const form = room.querySelector("form")
    form.addEventListener("submit", handleMessageSubmit)
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

socket.on("welcome", () => {
    addMessage("Someone Joined 😀")
})
socket.on("new_message", addMessage)
socket.on("bye", () => { addMessage("Someone left 🙁") })