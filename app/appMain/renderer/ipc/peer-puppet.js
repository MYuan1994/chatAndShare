const { ipcRenderer, desktopCapturer } = require('electron');

async function getScreenStream() {
    const sources = await desktopCapturer.getSources({ types: ['screen'] });

    return new Promise((resolve,reject)=>{
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
            resolve(stream)
            // peer.emit('add-stream', stream, DesktopDom)
        }, (err) => {
            console.error(err);
        })
    })

}


const pc=new window.RTCPeerConnection({});
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

async function createAnswer(offer){

    let stream=await getScreenStream();

    pc.addStream(stream);
    await pc.setRemoteDescription(offer)
    await pc.setLocalDescription(await pc.createAnswer())

    console.log(JSON.stringify(pc.localDescription))

    return pc.localDescription;
}

window.createAnswer=createAnswer;