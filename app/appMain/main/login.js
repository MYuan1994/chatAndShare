
const {appList}=require('./window');
const path=require('path');
const Store=require('electron-store');

let contacts;

function handleLogin(data){
    let win=appList.list.get('Main');
    if(data.result==='success'){
        win.users=data.users;
        win.user='';
        win.loadFile(path.resolve(__dirname,'../renderer/index.html'))
        loadLocalCache(user);
    }else{
        win.webContents.send('login-failed',data.msg);
    }
}

async function loadLocalCache(user){
    console.log(111)
    contacts= new Store({
        name:'cur_user',
        clearInvalidConfig:true,
        cwd:`${app.getPath('userData')}/ChatCache/`
    })
    console.log(user)
    contacts.set(user)
}

module.exports={handleLogin}