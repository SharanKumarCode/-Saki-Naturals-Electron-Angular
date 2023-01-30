import { contextBridge, ipcRenderer } from 'electron';

console.log("Inside preload.js")

let bridge = {
    updateMessage: (callback) => ipcRenderer.on("updateMessage", callback)
}

contextBridge.exposeInMainWorld( 'electronapi', bridge)