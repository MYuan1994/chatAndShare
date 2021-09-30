const { ipcRenderer } = require('electron');
const MyPeerConnection = require('./ipc/RTCPeerConnection')
const { linkVedioChat, getScreenStream } = require('./ipc/viewDL');
const EventEmitter = require('events');
const { RTCPeerConnection, RTCSessionDescription } = window;

let pc;
let candidates = [];
let channel;
const peer = new EventEmitter();



peer.on('add-stream', (stream, DesktopDom) => {
    DesktopDom.srcObject = stream;
    DesktopDom.onloadedmetadata = () => {
        DesktopDom.play();
    }
})



ipcRenderer.once('accept-offer', async (event, SDP) => {

    pc = new RTCPeerConnection({});

    channel=pc.createDataChannel('my channel');
    channel.onopen=()=>{
        console.log('open')
    }
    channel.onclose=()=>{
        console.log('close')
    }
    channel.onmessage=(event)=>{
        document.getElementById('extChat').appendChild(document.createElement('li').innerHTML=`${event.data}`)
    }

    document.getElementById('sendText').onclick=()=>{
        let msg=document.getElementById('chatText').value;
        channel.send(msg)
    }


    // linkVedioChat(myView,pc);
    pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(SDP)));
    pc.onaddstream = function (stream) {
        console.log('sssssss')
        peer.emit('add-stream', stream, document.getElementById('objView'));
    }
    // pc.ontrack=function(event){
    //     console.log(111111111111)
    // }
    pc.addEventListener('icecandidateerror', (event) => {
        alert(event)
    })
    pc.onicecandidate = (e) => {
        if (e.candidate) {
            console.log(JSON.stringify(e.candidate))
            ipcRenderer.invoke('exchangeCandidate', 'client2', JSON.stringify(e.candidate));
        }
    }


    let answer = await pc.createAnswer();
    pc.setLocalDescription(answer)



    ipcRenderer.invoke('linkTo', 'answer', 'client2', JSON.stringify(answer));

});

ipcRenderer.once('accept-answer', (event, SDP) => {
    pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(SDP)));
});

ipcRenderer.on('accept-candidate', async (event, candidate) => {
    if (candidate && candidate !== '') {
        candidates.push(candidate)
    }
    // if (pc && pc.remoteDescription && pc.remoteDescription.type) {
    //     for (candidateTemp of candidates) {
    //         await pc.addIceCandidate(JSON.parse(candidateTemp));
    //     }
    //     candidates = [];
    // }
});


function closeWin(id) {
    ipcRenderer.invoke('closeAppWin', {
        id: id
    })
}


function videoChat(username, myView, objView) {

    pc = new MyPeerConnection(objView);

    channel=pc.createDataChannel('my channel');
    channel.onopen=()=>{
        console.log('open')
    }
    channel.onclose=()=>{
        console.log('close')
    }
    channel.onmessage=(event)=>{
        document.getElementById('extChat').appendChild(document.createElement('li').innerHTML=`${event.data}`)
    }

    document.getElementById('sendText').onclick=()=>{
        let msg=document.getElementById('chatText').value;
        channel.send(msg)
    }

    linkVedioChat(myView,pc)
    pc.onicecandidate = (e) => {
        if (e.candidate) {
            // console.log(JSON.stringify(e.candidate))
            ipcRenderer.invoke('exchangeCandidate', username, JSON.stringify(e.candidate));
        }
    }

    pc.createOfferSDP().then((offer) => {
        ipcRenderer.invoke('linkTo', 'offer', username, JSON.stringify(offer));
    })


}



function desktopShare(viewDom) {
    getScreenStream(viewDom);
}


function login(username, password) {

    ipcRenderer.once('login-failed', (event, msg) => {
        alert(JSON.stringify(msg));
    });

    return new Promise((resolve, reject) => {
        let res = ipcRenderer.invoke('login', username, password);
        resolve()
    }).then(() => {
        console.log('提交成功')
    }).catch(err => {
        console.warn('连接服务器失败！')
    })
}

function getUsers() {
    return ipcRenderer.invoke('getUserList');
}


