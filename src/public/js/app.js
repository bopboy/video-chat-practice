const socket = io()

const myFace = document.querySelector("#myFace")
const muteBtn = document.querySelector("#mute")
const cameraBtn = document.querySelector("#camera")
const cameraSelect = document.querySelector("#cameras")

let myStream
let muted = false
let cameraoff = false

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
getMedia()

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