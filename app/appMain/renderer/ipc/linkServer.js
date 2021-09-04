const WebSocket=require('ws');


function createConnection(type,ip,port){
    let connect=null;
    if(type==='ws'){
        connect=connectWS(ip,port)
    }
    return connect;
}

function connectWS(ip,port){
    let ws=new WebSocket(`ws://${ip}:${port}`);
    return ws;
}


module.exports={createConnection}