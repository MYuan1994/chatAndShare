const WebSocket=require('ws');
const {handleLogin}=require('./login')
const {handleOffer}=require('./call')


function createConnection(type,ip,port){
    let connect=null;
    if(type==='ws'){
        connect=connectWS(ip,port);
    }
    return connect;
}

function connectWS(ip,port){
    let ws=new WebSocket(`ws://${ip}:${port}`);

    ws.on('open',()=>{
        ws.send(JSON.stringify({id:'uasufuyyu2gueg2u3eu',name:'张明远'}));
    })

    ws.on('message',(msg)=>{
        let data=msg.toString();
        try {
            data=JSON.parse(data)
        } catch (error) {
            console.error(error)
        }
        if(data.command){
            switch(data.command){
                case 'login':
                    handleLogin(data);
                    break;
                case 'linkTo':
                    handleOffer(data);
                    break;
                default:
                    console.log('other',data);
            }
        }
    })


    return ws;
}


module.exports={createConnection}