const { ipcMain } = require('electron');
const robot = require('robotjs');
const vkey = require('vkey');

function handleMouse(data) {
    let x = data.clientX * data.screen.width / data.video.width;
    let y = data.clientY * data.screen.height / data.video.height;
    robot.moveMouse(x, y);
    robot.mouseClick();
}

function handleKey(data) {
    const modifiers = [];
    if (data.meta)
        modifiers.push('meta')
    if (data.shift)
        modifiers.push('shift')
    if (data.ctrl)
        modifiers.push('ctrl')
    if (data.alt)
        modifiers.push('alt')

    let key = vkey[data.keyCode].toLowerCase();
    if(key[0]!=='<'){
        robot.keyTap(key, modifiers);
    }
    
}


module.exports = function () {
    ipcMain.on('robot', (event, type, data) => {
        if (type === 'mouse') {
            handleMouse(data);
        } else if (type = 'key') {
            handleKey(data);
        }
    })
}()