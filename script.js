
let localcamera = document.getElementById("localVideo");
let remotecamera = document.getElementById("remoteVideo");
const camera = document.getElementById("camera");
let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
async function setupCamera() {
   
    localcamera.srcObject = stream;
} 
setupCamera();