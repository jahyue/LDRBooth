let peer = null;
let localcamera = document.getElementById("localVideo");
let remotecamera = document.getElementById("remoteVideo");
let invitelink = document.getElementById("invitelink");
const createButton = document.getElementById("createButton");
const joinButton = document.getElementById("joinButton");
const camera = document.getElementById("camera");
const params = new URLSearchParams(window.location.search);
const roomID = params.get("room");
if (roomID) {
    console.log("guest");
    createButton.style.display = "none";
}else {
    console.log("host");
    joinButton.style.display = "none";
}
let stream = null;
const setupCamera = async () => {
    try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localcamera.srcObject = stream;
    } catch (error) {
    console.error("Error accessing camera and microphone:", error);
    }
}
joinButton.addEventListener("click", async () => {
    peer = new Peer();
    await setupCamera();
    peer.on("open", (id) => {
        console.log("My peer ID is: " + id);
        const call = peer.call(roomID, stream);
        call.on("stream", (remoteStream) => {
            remotecamera.srcObject = remoteStream;
        });
    });
});
createButton.addEventListener("click", async () => {
    peer = new Peer();
    await setupCamera();
    peer.on("open", (id) => {
        console.log("Room ID: " + roomID);
        console.log("My peer ID is: " + id);
        invitelink.textContent = `Share this link to invite someone: https://jahyue.github.io/LDRBooth/?room=${id}`;
        invitelink.href = `https://jahyue.github.io/LDRBooth/?room=${id}`;
    });
    peer.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (remoteStream) => {
            remotecamera.srcObject = remoteStream;
        });
    });
});
