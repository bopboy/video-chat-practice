const socket = io()

const welcome = document.querySelector("#welcome")
const form = welcome.querySelector("form")
const room = document.querySelector('#room')

let roomName

room.hidden = true
const showRoom = () => {
    welcome.hidden = true
    room.hidden = false
    const h3 = room.querySelector('h3')
    h3.innerText = `Room: ${roomName}`
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
    addMessage("Someone Joined")
})