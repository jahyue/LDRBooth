let localcamera = document.getElementById("localVideo");
let remotecamera = document.getElementById("remoteVideo");
const camera = document.getElementById("camera");
async function setupCamera() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    localcamera.srcObject = stream;
} 
setupCamera();