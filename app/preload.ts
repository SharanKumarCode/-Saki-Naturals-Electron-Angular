import { contextBridge, ipcRenderer } from 'electron';

import { getProducts, inserProduct } from './db/db_manager';

console.log("Inside preload.js")

contextBridge.exposeInMainWorld( 'electronapi', {
    send: ( channel: string ) => ipcRenderer.invoke( channel ),
    getProducts: getProducts,
    insertProducts: inserProduct
})