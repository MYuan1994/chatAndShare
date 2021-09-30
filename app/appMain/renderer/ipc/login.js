const {ipcRenderer}=require('electron')

// let 

async function login(username,password){
    return await fetch(`http://60.205.213.132:8010/login?username=${username}&password=${password}`)
        .then((response)=>{
            return response.json();
        }).then(data=>{
            return handleResult(data);
        }).catch(err=>{
            alert('访问服务器失败，请检查网络或联系管理员！')
            console.log(err)
        })
}

function handleResult(data){
    return data.result&&data.result==='success'?handleSuccess(data):handleError(data)
}

function handleSuccess(data){
    ipcRenderer.invoke('login-success',data.user)
    return null;
}

function handleError(data){
    return data;
}

function visitHome(){
    ipcRenderer.invoke('visitHome')
}

function closeLogin(id){
    ipcRenderer.invoke('closeAppWin', {
        id: id
    })
}

module.exports={login,visitHome}

