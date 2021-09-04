
const {appList}=require('./window');
const path=require('path');


function handleLogin(data){
    let win=appList.list.get('Main');
    if(data.result==='success'){
        win.users=data.users;
        win.user=''
        win.loadFile(path.resolve(__dirname,'../renderer/index.html'))
    }else{
        win.webContents.send('login-failed',data.msg);
    }
}

module.exports={handleLogin}