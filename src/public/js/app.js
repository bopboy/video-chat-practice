const socket = new WebSocket(`ws://${window.location.host}`)
const messageList = document.querySelector("ul")
const messageForm = document.querySelector("#message")
const nickForm = document.querySelector("#nick")

const makeMessage = (type, payload) => {
    const msg = { type, payload }
    return JSON.stringify(msg)
}
socket.addEventListener("open", (message) => {
    console.log("Connected To Server ✅")
})
socket.addEventListener("message", (message) => {
    const li = document.createElement("li")
    li.innerText = message.data
    messageList.append(li)
})
socket.addEventListener("close", () => {
    console.log("Disconnected from server ❌")
})
messageForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const input = messageForm.querySelector("input")
    socket.send(makeMessage("new_message", input.value))
    input.value = ''
})
nickForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const input = nickForm.querySelector("input")
    socket.send(makeMessage("nickname", input.value))
    // input.value = '' // 이건 안하는 것이 나은 거 같다.
})