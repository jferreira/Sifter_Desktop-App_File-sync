const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ocr', {
    selectFolder: () => ipcRenderer.send('ocr:selectFolder'),
    initOcr: (fileTree) => ipcRenderer.send('ocr:init', fileTree),
    onDirs: (cb) => ipcRenderer.on('ocr:folderSelected', (event, args) => {
        const dir = args;
        cb(dir)
    }),
    onIndexed: (cb) => ipcRenderer.on('ocr:indexed', (event, args) => cb(args))
})

contextBridge.exposeInMainWorld('search', {
    find: (term) => ipcRenderer.send("search:find", term),
    onResult: (cb) => ipcRenderer.on('search:result', (e, args) => cb(args)),
    openFile: (path) => ipcRenderer.send('search:openFile', path)
})