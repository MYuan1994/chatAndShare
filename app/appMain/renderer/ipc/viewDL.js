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
function linkVedioChat(username,myView,objView) {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: { ideal: 300, min: 200, max: 500 },
            height: { ideal: 400, min: 300, max: 600 },
            frameRate: { ideal: 20, min: 10, max: 30 }
        }
    }).then(async(stream) => {
        myView.srcObject = stream;
        myView.onloadedmetadata = function () {
            myView.play();
        }
        let offer=await createOffer();
        ipcRenderer.invoke('linkTo','offer',username,JSON.stringify(offer))
        
    });
}


//传输部分
const pc = new window.RTCPeerConnection({});
pc.onicecandidate = function (e) {
    console.log(JSON.stringify(e.candidate))
}

let candidates=[];

async function addIceCandidate(candidate) {
    if(candidate){
        candidates.push(candidate);
    }
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for(let candidateTmp of candidates){
            await pc.addIceCandidate(new RTCIceCandidate(candidateTmp))
        }
        candidates=[];
    }
}
window.addIceCandidate=addIceCandidate;

async function createOffer() {
    const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    })
    await pc.setLocalDescription(offer)
    // console.log('my offer is :', JSON.stringify(offer));

    // return pc.localDescription;
    return offer;
}

async function setRemote(answer) {
    await pc.setRemoteDescription(answer)
}
window.setRemote = setRemote
pc.onaddstream = function (e) {

    console.log(e);

    peer.emit('add-stream', e.stream, document.getElementById('share'));
}

module.exports = { linkVedioChat, getScreenStream, createOffer }