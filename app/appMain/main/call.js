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
        console.log(data.SDP);
        win.webContents.send('accept-vChat',data.SDP);
    })
    notic.on('close',()=>{
        console.log('reject');
        let win=appList.list.get('Main');
        win.webContents.send('accept-vChat',data.SDP);
    })
}

module.exports={handleOffer}