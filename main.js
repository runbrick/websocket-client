const {app, BrowserWindow, Menu, dialog, ipcMain} = require("electron");

/**
 * 创建窗口
 */
function createWindow() {
    const bw = new BrowserWindow({
        width: 400,
        height: 580,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        resizable: false // 禁止调整大小
    })
    // 打开调试
    // bw.webContents.openDevTools()
    bw.loadFile("index.html")
}

app.whenReady().then(() => {
    createWindow()
})


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
// 设置没有菜单
Menu.setApplicationMenu(null)

ipcMain.on("errmsg", function (event, arg) {
    dialog.showMessageBox({
        type: "error",
        message: arg
    })
    return false;
})

ipcMain.on("sucmsg", function (event, arg) {
    dialog.showMessageBox({
        type: "info",
        message: arg
    })
    return false;
})
