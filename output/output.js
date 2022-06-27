const video = document.getElementById('outvdo');

function changeStream(stream) {
    video.srcObject = stream;
}