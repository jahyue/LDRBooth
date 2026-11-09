let peer = new Peer();
let localcamera = document.getElementById("localVideo");
let remotecamera = document.getElementById("remoteVideo");
const camera = document.getElementById("camera");
let stream = null;
async function setupCamera() {
    try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localcamera.srcObject = stream;
    } catch (error) {
        console.error("Error accessing camera and microphone:", error);
    }
} 
setupCamera();