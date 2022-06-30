const peer = new Peer({
    key: "bcb91944-4eb7-45da-9c09-0b8fc765243d",
    debug: 3,
});

let room;
let streams = [];

function join(roomName, localStream) {

    room = peer.joinRoom(roomName, {
        mode: "mesh",
        stream: localStream,
    });
    room.on("open", () => {
        document.getElementById('connected').classList.remove("hide");
        document.getElementById('disconnected').classList.add("hide");
    });

    room.on("close", () => {
        document.getElementById('connected').classList.add("hide");
        document.getElementById('disconnected').classList.remove("hide");
    })
    room.on("stream", async(stream) => {
        // ピアのvideo要素の追加
        const newVideoPanel = document.createElement("div");
        newVideoPanel.style.backgroundColor = "rgb(16,32,64)";
        newVideoPanel.textContent = stream.peerId;
        newVideoPanel.style.width = "100%";
        newVideoPanel.style.height = "200px";
        const newVideo = document.createElement("video");
        newVideo.srcObject = stream;
        newVideo.playsInline = true;
        newVideo.style.height = "calc( 200px - 1rem)";
        newVideo.style.width = "100%";
        newVideo.classList.add("preview");
        newVideoPanel.appendChild(newVideo);
        document.getElementById('streams').appendChild(newVideoPanel);
        await newVideo.play().catch(console.error);
        streams.push(stream);
        newVideoPanel.onclick = () => {
            window.opener.document.getElementById('outvdo').srcObject = stream;
        }
    });
    room.on("peerLeave", (peerId) => {
        streams.filter(stream => stream.peerId = peerId);

    });
}

async function shareCam() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputDevice = devices.find(
        (device) => device.kind === "videoinput"
    );
    const audioInputDevice = devices.find(
        (device) => device.kind === "audioinput"
    );
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: videoInputDevice.deviceId,
            width: 1920,
            height: 1080,
        },
        audio: {
            deviceId: audioInputDevice.deviceId,
        }

    });
    document.getElementById('srcvdo').srcObject = stream;
    room.replaceStream(stream);
}

async function shareScreen() {
    localStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                width: 1920,
                height: 1080,
                cursor: 'never',
            },
            audio: true,
        })
        .then(stream => {
            document.getElementById('srcvdo').srcObject = stream;
            room.replaceStream(stream);
        });
}