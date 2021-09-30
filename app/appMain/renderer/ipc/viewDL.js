const EventEmitter = require('events');
const { ipcRenderer, desktopCapturer } = require('electron');
// const { appList } = require('../../main/window');

const peer = new EventEmitter();

//获取桌面流
async function getScreenStream(DesktopDom) {
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    navigator.webkitGetUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sources[0].id,
                maxWidth: window.screen.width,
                maxHeight: window.screen.height
            }
        }
    }, (stream) => {
        peer.emit('add-stream', stream, DesktopDom)
    }, (err) => {
        console.error(err);
    })
}
peer.on('add-stream', (stream, DesktopDom) => {
    DesktopDom.srcObject = stream;
    DesktopDom.onloadedmetadata = () => {
        DesktopDom.play();
    }
})

//视频通话
async function linkVedioChat(myView, pc) {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: { ideal: 300, min: 200, max: 500 },
            height: { ideal: 400, min: 300, max: 600 },
            frameRate: { ideal: 20, min: 10, max: 30 }
        }

    }).then((stream) => {

        pc.addStream(stream);

        // for(let track of stream.getTracks()){
        //     pc.addTrack(track,stream);
        // }

        // myView.srcObject=stream;
        // myView.onloadedmetadata=function(){
        //     myView.play();
        // }
    })


}


//传输部分
const pc = new window.RTCPeerConnection({});
pc.onicecandidate = function (e) {
    console.log(JSON.stringify(e.candidate))
}

let candidates = [];

async function addIceCandidate(candidate) {
    if (candidate) {
        candidates.push(candidate);
    }
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let candidateTmp of candidates) {
            await pc.addIceCandidate(new RTCIceCandidate(candidateTmp))
        }
        candidates = [];
    }
}
window.addIceCandidate = addIceCandidate;


module.exports = { linkVedioChat, getScreenStream }