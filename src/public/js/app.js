const socket = io()

const myFace = document.querySelector("#myFace")
const muteBtn = document.querySelector("#mute")
const cameraBtn = document.querySelector("#camera")

let myStream
let muted = false
let cameraoff = false

const getMedia = async () => {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio: true, video: true
        })
        myFace.srcObject = myStream
    } catch (e) {
        console.log(e)
    }
}
getMedia()

const handleMuteClick = () => {
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
    if (cameraoff) {
        cameraBtn.innerText = "Turn Camera Off"
        cameraoff = false
    } else {
        cameraBtn.innerText = "Turn Camera On"
        cameraoff = true
    }
}
cameraBtn.addEventListener("click", handleCameraClick)
