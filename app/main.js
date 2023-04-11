// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const { resolve } = require('path')
const path = require('path')
const fs = require('fs')
const { deepReadDir, isFileSupportedForOcr } = require('./lib/utils')
const { Ocr } = require('./lib/ocr')
const { search } = require('./lib/search')

let mainWindow = null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        // fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile(resolve(__dirname, '../dist/index.html'))

    // Open the DevTools.
    // if (process.env.DEV == "true") {
    // mainWindow.webContents.openDevTools()
    // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    ipcMain.on('ocr:selectFolder', async (event) => {
        const dir = dialog.showOpenDialogSync(mainWindow, {
            properties: ['openDirectory']
        });

        if (!dir) {
            event.sender.send('ocr:folderSelected', []);
            return;
        }

        let fileTree = await deepReadDir(dir[0]);

        event.sender.send('ocr:folderSelected', fileTree)
    })

    ipcMain.on('ocr:init', async (event, fileTree) => {
        async function walk(node) {
            if (node.type == "file") {
                if (!isFileSupportedForOcr(node.path)) return
                const data = await Ocr(node.path);
                search.addDoc({ ...data, path: node.path })
                event.sender.send('ocr:indexed', node)
            }
            node?.children.forEach(c => {
                walk(c)
            });
        }

        fileTree.forEach(c => walk(c))
    })

    ipcMain.on('search:find', (event, term) => {
        const res = search.search(term);
        event.sender.send('search:result', res);
    })

    ipcMain.on('search:openFile', async (event, path) => {
        try {
            shell.openPath(path)
        } catch (error) {
            console.log(error);
        }
    })

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
