let peer = new Peer();
let localcamera = document.getElementById("localVideo");
let remotecamera = document.getElementById("remoteVideo");
let invitelink = document.getElementById("invitelink");
const camera = document.getElementById("camera");
let stream = null;
peer.on("open", (id) => {
    console.log("My peer ID is: " + id);
    invitelink.textContent = `Share this link to invite someone: https://jahyue.github.io/LDRBooth/?room=${id}`;
    invitelink.href = `https://jahyue.github.io/LDRBooth/?room=${id}`;
});
async function setupCamera() {
    try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localcamera.srcObject = stream;
    } catch (error) {
        console.error("Error accessing camera and microphone:", error);
    }
} 
setupCamera();