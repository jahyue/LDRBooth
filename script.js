let peer = null;
let localcamera = document.getElementById("localVideo");
let remotecamera = document.getElementById("remoteVideo");
let invitelink = document.getElementById("invitelink");
let dataConnection = null;
const createButton = document.getElementById("createButton");
const startButton = document.getElementById("startButton");
const joinButton = document.getElementById("joinButton");
const camera = document.getElementById("camera");
const ctx = camera.getContext("2d");
const photosDiv = document.getElementById("photos");
const params = new URLSearchParams(window.location.search);
const roomID = params.get("room");

if (roomID) {
    console.log("guest");
    createButton.style.display = "none";
}else {
    console.log("host");
    joinButton.style.display = "none";
}
function drawframe() {
    const localcropWidth = localcamera.videoHeight *((camera.width / 2) / camera.height);
    const localcropX = (localcamera.videoWidth - localcropWidth) / 2;
 
    requestAnimationFrame(drawframe);
    ctx.drawImage(localcamera, localcropX, 0, localcropWidth, localcamera.videoHeight, 0, 0, camera.width / 2, camera.height);
    if (remotecamera.readyState >= 2) {
           const remotecropWidth = remotecamera.videoHeight *((camera.width / 2) / camera.height);
    const remotecropX = (remotecamera.videoWidth - remotecropWidth) / 2;
        ctx.drawImage(remotecamera, remotecropX, 0, remotecropWidth, remotecamera.videoHeight, camera.width / 2, 0, camera.width / 2, camera.height);
    }
}
let stream = null;
const setupCamera = async () => {
    try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localcamera.srcObject = stream;
    await localcamera.play();
    console.log("Camera and microphone access granted.");
    
    drawframe();
    } catch (error) {
    console.error("Error accessing camera and microphone:", error);
    }
}
startButton.addEventListener("click", async () => {
    
    camera.toBlob((blob) => {
        const newImg = document.createElement('img');
        const url = URL.createObjectURL(blob);
  
        newImg.src = url;
        photosDiv.appendChild(newImg);
        if (dataConnection && dataConnection.open) {
            dataConnection.send(blob);
        }else {
            console.error("Data connection is not open. Cannot send image.");
        }
     
    }, "image/jpeg",0.95);

});
joinButton.addEventListener("click", async () => {
    await setupCamera();
    peer = new Peer();
    peer.on("open", (id) => {
        console.log("My peer ID is: " + id);
        const call = peer.call(roomID, stream);
        dataConnection = peer.connect(roomID);
        dataConnection.on("open", () => {
            console.log("Data connection established with host.");
        });
        dataConnection.on("data", (data) => {
            const image = document.createElement("img");
    image.src = URL.createObjectURL(data);
    photosDiv.appendChild(image);
        });
        call.on("stream", (remoteStream) => {
            remotecamera.srcObject = remoteStream;
        });
        call.on("error", (err) => {
            console.error("Call error:", err);
        });
    });
});
createButton.addEventListener("click", async () => {
    await setupCamera();
    peer = new Peer(); 
    
    peer.on("open", (id) => {
        console.log("Room ID: " + roomID);
        console.log("My peer ID is: " + id);
        invitelink.textContent = `Share this link to invite someone: https://jahyue.github.io/LDRBooth/?room=${id}`;
        invitelink.href = `https://jahyue.github.io/LDRBooth/?room=${id}`;
    });
    peer.on("connection", (connection) => {
        dataConnection = connection;
        dataConnection.on("open", () => {
            console.log("Data connection established with guest.");
        });
        connection.on("data", (data) => {
        const image = document.createElement("img");
    image.src = URL.createObjectURL(data);
    photosDiv.appendChild(image);

       });
    }); 
    
    

    peer.on("call", (call) => {
        console.log("Incoming call from: " + call.peer);
        call.answer(stream);
        call.on("stream", (remoteStream) => {
            remotecamera.srcObject = remoteStream;
        });
        call.on("error", (err) => {
            console.error("Call error:", err);
        });
    });
});
