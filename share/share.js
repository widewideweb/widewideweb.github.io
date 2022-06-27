(async function() {
    const localMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const localVideo = document.getElementById('srcvdo');
    localVideo.srcObject = localMediaStream;
    const config = { 'icesrv': [{ 'urls': 'stun:stun.google.com:19302' }] };
    const peer = new RTCPeerConnection(config);
    const transceiver = peer.addTransceiver(stream.getVideoTracks()[0]);
    transceiver.receiver.track.enabled = false;
    transceiver.setDirection('sendonly');
})()