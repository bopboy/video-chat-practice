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