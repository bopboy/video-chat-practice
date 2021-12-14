const socket = io()

const myFace = document.querySelector("#myFace")
const muteBtn = document.querySelector("#mute")
const cameraBtn = document.querySelector("#camera")
const cameraSelect = document.querySelector("#cameras")
const call = document.querySelector("#call")
call.hidden = true

let myStream
let muted = false
let cameraoff = false
let roomName
let myPeerConnection

const getCameras = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const cameras = devices.filter(device => device.kind === "videoinput")
        const currentCamera = myStream.getVideoTracks()[0]
        cameras.forEach(camera => {
            const option = document.createElement("option")
            option.value = camera.deviceId
            option.innerText = camera.label
            if (currentCamera.label === camera.label) option.selected = true
            cameraSelect.appendChild(option)
        })
    } catch (e) {
        console.log(e)
    }
}

const getMedia = async (deviceId) => {
    const initialConstraints = { audio: true, video: { facingMode: "user" } }
    const cameraConstraints = { audio: true, video: { deviceId: { exact: deviceId } } }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraints
        )
        myFace.srcObject = myStream
        if (!deviceId) await getCameras()
    } catch (e) {
        console.log(e)
    }
}
// getMedia()

// video call
const handleMuteClick = () => {
    myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled)
    if (!muted) {
        muteBtn.innerText = "Unmute"
        muted = true
    } else {
        muteBtn.innerText = "Mute"
        muted = false
    }
}
muteBtn.addEventListener("click", handleMuteClick)
const handleCameraClick = () => {
    myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled)
    if (cameraoff) {
        cameraBtn.innerText = "Turn Camera Off"
        cameraoff = false
    } else {
        cameraBtn.innerText = "Turn Camera On"
        cameraoff = true
    }
}
cameraBtn.addEventListener("click", handleCameraClick)
const handleCameraChange = async () => {
    await getMedia(cameraSelect.value)
}
cameraSelect.addEventListener("input", handleCameraChange)

// Join a room
const welcome = document.querySelector("#welcome")
const welcomeForm = welcome.querySelector("form")

const initCall = async () => {
    welcome.hidden = true
    call.hidden = false
    await getMedia()
    makeConnection()
}
const handleWelcomeSubmit = async (event) => {
    event.preventDefault()
    const input = welcomeForm.querySelector("input")
    await initCall()
    socket.emit("join_room", input.value)
    roomName = input.value
    input.value = ""
}
welcome.addEventListener("submit", handleWelcomeSubmit)

// Socket Code
socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer()
    myPeerConnection.setLocalDescription(offer)
    console.log("sent the offer")
    socket.emit("offer", offer, roomName)
})

socket.on("offer", async (offer) => {
    console.log("received the offer")
    myPeerConnection.setRemoteDescription(offer)
    const answer = await myPeerConnection.createAnswer()
    myPeerConnection.setLocalDescription(answer)
    socket.emit("answer", answer, roomName)
    console.log("sent the answer")
})

socket.on("answer", (answer) => {
    console.log("received the answer")
    myPeerConnection.setRemoteDescription(answer)
})

socket.on("ice", ice => {
    console.log("received the candidate")
    myPeerConnection.addIceCandidate(ice)
})
// RTC code
const handleIce = (data) => {
    console.log("sent the candidate")
    socket.emit("ice", data.candidate, roomName)
}
const handleAddStream = (data) => {
    const peerStream = document.querySelector("#peerFace")
    peerStream.srcObject = data.stream
    // console.log("got an stream from my peer")
    // console.log("Peer's Stream", data.stream)
    // console.log("My Stream", myStream)
}
const makeConnection = () => {
    myPeerConnection = new RTCPeerConnection()
    myPeerConnection.addEventListener("icecandidate", handleIce)
    myPeerConnection.addEventListener("addstream", handleAddStream)
    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream))
}