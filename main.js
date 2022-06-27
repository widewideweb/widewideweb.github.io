const peer = new Peer({
    key: "bcb91944-4eb7-45da-9c09-0b8fc765243d",
    debug: 3,
});

let room;

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
        const newVideo = document.createElement("video");
        newVideo.srcObject = stream;
        newVideo.playsInline = true;
        newVideo.classList.add("outvdo");
        newVideo.setAttribute("peer-id", stream.peerId);
        newVideo.setAttribute("width", "400px");
        document.getElementById('outvdo-panel').appendChild(newVideo);
        await newVideo.play().catch(console.error);
    });


}
async function shareCam() {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            document.getElementById('srcvdo').srcObject = stream;
            room.replaceStream(stream);
        })
}

async function shareScreen() {
    localStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(stream => {
            document.getElementById('srcvdo').srcObject = stream;
            room.replaceStream(stream);
        });
}