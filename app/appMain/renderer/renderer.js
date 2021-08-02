const { ipcRenderer } = require('electron');
const {linkVedioChat,getScreenStream,createOffer}=require('./ipc/viewDL')


function openApp(){

}

function closeWin(id){
    ipcRenderer.invoke('closeAppWin',{
        id:id
    })
}


function videoChat(liveDom){
    linkVedioChat(liveDom);
}

function desktopShare(viewDom){
    getScreenStream(viewDom);
}

function p2p(){
    createOffer();
}
