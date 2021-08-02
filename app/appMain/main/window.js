const { BrowserWindow,ipcMain } = require('electron');
const electronIsDev=require('electron-is-dev');
const path=require('path')
const os =require('os');

function createwindow(args,appname){
    let win=new BrowserWindow(args);
    let win2=new BrowserWindow(args);
    if(electronIsDev){
        // win.loadURL("http://localhost:3000");
        win2.loadFile(path.resolve(__dirname,'../renderer/master.html'));
        win.loadFile(path.resolve(__dirname,'../renderer/index.html'));
    }else{
        win.loadFile(path.resolve(__dirname,'../renderer/index.html'))
    }
    ipcMain.handle('closeAppWin',async(id)=>{
        let res=await new Promise((resolve,reject)=>{
            console.log(id);
            win.close();
        })
    })

    return win;
}

module.exports={createwindow}


