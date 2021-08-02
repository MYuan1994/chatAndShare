const { app,ipcMain } = require('electron');
const {createwindow}=require('./window');

let appList=[];
//create window,tray
app.on("ready",()=>{
    
    let win=createwindow({
        width:800,
        height:600,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false,
            enableRemoteModule: true,
        }
    },"zmyMain");

    appList.push("zmyMain",win);
    

    require('./robot.js')


    // console.log(appList);
})

app.allowRendererProcessReuse = false;