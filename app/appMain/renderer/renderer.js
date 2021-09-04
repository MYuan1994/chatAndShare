const { ipcRenderer } = require('electron');
const {linkVedioChat,getScreenStream}=require('./ipc/viewDL')

ipcRenderer.once('accept-vChat',(event,SDP)=>{
    alert(JSON.stringify(SDP));
});


function closeWin(id){
    ipcRenderer.invoke('closeAppWin',{
        id:id
    })
}


function videoChat(username,myView,objView){


    linkVedioChat(username,myView,objView);
}

function videoChat(username,myView,objView){
    linkVedioChat(username,myView,objView);
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


