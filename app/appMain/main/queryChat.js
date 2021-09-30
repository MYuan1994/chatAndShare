const { ipcMain, app } = require('electron');

const Store = require('electron-store')




function initChat(userId) {

    let list=[];
    const chatList = new Store({
        name: "recordList",
        clearInvalidConfig: true,
        cwd: `${app.getPath('userData')}/ChatCache/${userId}/`
    })

    

    ipcMain.handle('queryChatList', async (event) => {
        list=[];
        chatList.get('chatList').map(chat => {

            let chatTemp = new Store({
                name: chat.chatId,
                clearInvalidConfig: true,
                cwd: `${app.getPath('userData')}/ChatCache/${userId}/recordList`
            })
            
            if(chatTemp.get('records')){
                list.push({
                    ...chat,
                    'lastMsg':chatTemp.get('records').pop().msg
                })
            }
        })

        return await new Promise((resolve, reject) => {
            resolve(list);
        })
    })

    ipcMain.handle('getChatRecords', (event, {chatId, start, end}) => {

        let chatTemp = new Store({
            name: chatId,
            clearInvalidConfig: true,
            cwd: `${app.getPath('userData')}/ChatCache/${userId}/recordList`
        })

        return new Promise((resolve,reject)=>{
            resolve(chatTemp.get('records')?chatTemp.get('records'):[]);
        })
    })

    //add chat
    //update chats & records
}

module.exports = {
    initChat
}