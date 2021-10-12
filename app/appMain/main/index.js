const { app,ipcMain,Notification,shell,Tray } = require('electron');
const {appList}=require('./window');
const {createConnection}=require('./linkServer');
const path=require('path');

const {initChat}=require('./queryChat')






let connectToServer;
let win;

//create window,tray
app.on("ready",()=>{

    win=appList.createwindow({
        width:800,
        height:500,
        frame: false,
        // titleBarStyle: 'customButtonsOnHover',
        resizable:false,
        transparent: true,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            enableRemoteModule: true,
        }
    },"Main");

    ipcMain.handle('login-success',async(event,user)=>{
        try {
            initChat(user.id);
            win.hide();
            // win.loadFile(path.resolve(__dirname,'../../../src/appmain/build/index.html'))
            win.loadURL('http://localhost:3000/')
            win.setSize(1000,600)
            // win.setBounds({ x: 2, y: 225, width: 900, height: 600 })
            win.webContents.on('did-finish-load',()=>{
                win.center();
                win.show();
                win.capturePage().then(img=>{
                    let a=new Notification({
                        title:'ChatClient',
                        icon:img,
                        hasReply:true,
                        body:'欢迎使用zmy的ChatClient！当前未读信息有XXX封。'
                    })
                    a.show();
                })
            })
            
            connectToServer=createConnection('ws','60.205.213.132',8011,user);
        } catch (error) {
            console.error(error)
        }
    })
    ipcMain.handle('visitHome',async(event)=>{
        try {
            shell.openExternal("http://60.205.213.132:8011/control")
        } catch (error) {
            console.error(error)
        }
    })
    ipcMain.handle('linkTo',async(event,type,username,SDP)=>{
        let res=await new Promise((resolve,reject)=>{
            connectToServer.send(JSON.stringify({action:'linkTo',type:type,to:username,SDP:SDP}));
            resolve();
        })
    })
    ipcMain.handle('exchangeCandidate',async(event,username,candidate)=>{
        let res=await new Promise((resolve,reject)=>{
            connectToServer.send(JSON.stringify({action:'exchangeCandidate',to:username,candidate:candidate}));
            resolve();
        })
    })
})

app.allowRendererProcessReuse = false;