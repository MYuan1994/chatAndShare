const WebSocket=require('ws');
const {handleLogin}=require('./login')
const {handleOffer,handleAnswer,handleCandidate}=require('./call')


function createConnection(type,ip,port,user){
    let connect=null;
    if(type==='ws'){
        connect=connectWS(ip,port,user);
    }
    return connect;
}

function connectWS(ip,port,user){
    let ws=new WebSocket(`ws://${ip}:${port}/?id=${user.id}&code=${user.code}&username=${user.username}`);

    ws.on('open',()=>{
        // ws.send(JSON.stringify({id:'uasufuyyu2gueg2u3eu',name:'张明远'}));
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
                    data.type==='offer'?handleOffer(data):handleAnswer(data)
                    break;
                case 'exchangeCandidate':
                    handleCandidate(data);
                    break;
                default:
                    console.log('other',data);
            }
        }
    })


    return ws;
}


module.exports={createConnection}