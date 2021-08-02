const peer = require('./peer-control');
peer.on('add-stream', (stream) => {
    console.log('play stream')
    play(stream)
})

let view = document.getElementById('view');
function play(stream) {
    
    view.srcObject = stream;
    view.onloadedmetadata = () => {
        view.play();
    }
}

window.addEventListener('keydown', (ev) => {
    let data={
        keyCode:ev.keyCode,
        shift:ev.shiftKey,
        alt:ev.altKey,
        meta:ev.metaKey,
        control:ev.ctrlKey
    };
    peer.emit('robot','key',data);
});
window.addEventListener('mouseup', (ev) => {
    let data={};
    data.clientX=ev.clientX;
    data.clientY=ev.clientY;
    data.video={
        width:view.getBoundingClientRect().width,
        height:view.getBoundingClientRect().height
    }
    peer.emit('robot','mouse',data);
});