const { BrowserWindow,ipcMain, app } = require('electron');
const electronIsDev=require('electron-is-dev');
const path=require('path')
const os =require('os');


let appList={};
appList.list=new Map();


appList.createwindow=(args,appname)=>{
    let win=new BrowserWindow(args);
    // let win2=new BrowserWindow(args);
    if(electronIsDev){
        // win.loadURL("http://localhost:3000");
        win.loadFile(path.resolve(__dirname,'../renderer/login.html'));
    }else{
        win.loadFile(path.resolve(__dirname,'../renderer/index.html'))
    }
    ipcMain.handle('closeAppWin',async(id)=>{
        let res=await new Promise((resolve,reject)=>{
            console.log(id);
            win.close();
        })
    })
    //从缓存加载
    win.users=[];

    ipcMain.handle('getUserList',()=>{
        let res=win.users;
        return res;
    })

    appList.list.set(appname,win);
    return win;
}

appList.closeWin=(appname)=>{
    appList.list.get(appname).close();
}

module.exports={appList}


