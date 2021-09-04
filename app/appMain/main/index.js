const { app,ipcMain,Notification } = require('electron');
const {appList}=require('./window');
const {createConnection}=require('./linkServer')


let connectToServer;

//create window,tray
app.on("ready",()=>{
    
    appList.createwindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            enableRemoteModule: true,
        }
    },"Main");

    try {
        connectToServer=createConnection('ws','127.0.0.1',8010);
        appList.wssconnect=connectToServer;
    } catch (error) {
        console.error(error)
    }


    ipcMain.handle('login',async(event,username,password)=>{
        let res=await new Promise((resolve,reject)=>{
            connectToServer.send(JSON.stringify({action:'login','username':username,'password':password}));
            resolve();
        })
    })
    ipcMain.handle('linkTo',async(event,type,username,SDP)=>{
        let res=await new Promise((resolve,reject)=>{
            connectToServer.send(JSON.stringify({action:'linkTo',type:type,to:username,SDP:SDP}));
            resolve();
        })
    })
    // require('./robot.js')


    // console.log(appList);
})

app.allowRendererProcessReuse = false;