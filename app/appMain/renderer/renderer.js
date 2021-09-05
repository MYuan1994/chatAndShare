const { ipcRenderer } = require('electron');
const MyPeerConnection=require('./ipc/RTCPeerConnection')
const {linkVedioChat,getScreenStream}=require('./ipc/viewDL');

let pc;
let candidates=[];

ipcRenderer.once('accept-offer',async(event,SDP)=>{
    pc=new window.RTCPeerConnection();
    pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(SDP)));
    pc.onicecandidate = (e)=> {
        ipcRenderer.invoke('exchangeCandidate','client2',JSON.stringify(e.candidate));
    }
    
    let answer=await pc.createAnswer();
    pc.setLocalDescription(answer)
    

    
    ipcRenderer.invoke('linkTo','answer','client2',JSON.stringify(answer));

});

ipcRenderer.once('accept-answer',(event,SDP)=>{
    pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(SDP)));
});

ipcRenderer.on('accept-candidate',async(event,candidate)=>{
    if(candidate){
        candidates.push(candidate)
    }
    if(pc.remoteDescription&&pc.remoteDescription){
        for(candidateTemp of candidates){
            await pc.addIceCandidate(new RTCIceCandidate(candidateTemp));
        }
        candidates=[];
    }
});


function closeWin(id){
    ipcRenderer.invoke('closeAppWin',{
        id:id
    })
}


function videoChat(username,myView,objView){

    pc =new MyPeerConnection(objView);
    pc.onicecandidate = (e)=> {
        ipcRenderer.invoke('exchangeCandidate',username,JSON.stringify(e.candidate));
    }

    pc.createOfferSDP().then((offer)=>{
        console.log(pc.ownCandidate);
        ipcRenderer.invoke('linkTo','offer',username,JSON.stringify(offer));
    })

    linkVedioChat(myView,pc);
}



function desktopShare(viewDom){
    getScreenStream(viewDom);
}


function login(username,password){

    ipcRenderer.once('login-failed',(event,msg)=>{
        alert(JSON.stringify(msg));
    });

    return new Promise((resolve,reject)=>{
        let res=ipcRenderer.invoke('login',username,password);
        resolve()
    }).then(()=>{
        console.log('提交成功')
    }).catch(err=>{
        console.warn('连接服务器失败！')
    })
}

function getUsers(){
    return ipcRenderer.invoke('getUserList');
}


