const {Notification}=require('electron');
const {appList}=require('./window');

function handleOffer(data){

    let notic=new Notification({
        title:`发来一个视频请求`,
        body:'连接',
        actions:[{text:'接收',type:'button'}],
        closeButtonText:'拒接'
    });

    notic.show();
    notic.on('action',()=>{
        console.log('connect')
        let win=appList.list.get('Main');
        win.webContents.send('accept-offer',data.SDP);
    })
    notic.on('click',()=>{
        console.log('connect')
        let win=appList.list.get('Main');
        win.webContents.send('accept-offer',data.SDP);
    })
    notic.on('close',()=>{
        console.log('reject');
        let win=appList.list.get('Main');
        win.webContents.send('accept-offer',data.SDP);
    })
}

function handleAnswer(data){
    console.log('success link!')
    let win=appList.list.get('Main');
    win.webContents.send('accept-answer',data.SDP);
}

function handleCandidate(data){
    let win=appList.list.get('Main');
    win.webContents.send('accept-candidate',data.candidate);
}

module.exports={handleOffer,handleAnswer,handleCandidate}