const {purchaseDB} = require('../db/db_manager')

module.exports = {
    purchaseHandler: [
            global.share.ipcMain.handle('get-purchase', async () => {
                return purchaseDB.getAllPurchase();
            }),

            global.share.ipcMain.handle('get-purchase-by-id', async (_, data) => {
              return purchaseDB.getPurchaseByID(data);
            }),
        
            global.share.ipcMain.handle('insert-purchase', async (_, data) => {
                return purchaseDB.insertPurchase(data);
            }),

            global.share.ipcMain.handle('update-purchase', async (_, data) => {
                return purchaseDB.updatePurchase(data);
            }),
        
            global.share.ipcMain.handle('delete-purchase', async (_, data) => {
                return purchaseDB.deletePurchase(data);
            }),           
        
            global.share.ipcMain.handle('insert-purchase-transaction', async (_, data) => {
                return purchaseDB.insertPurchaseTransaction(data);
            }),

            global.share.ipcMain.handle('update-purchase-transaction', async (_, data) => {
                return purchaseDB.updatePurchaseTransaction(data);
            }),
        
            global.share.ipcMain.handle('delete-purchase-transaction', async (_, data) => {
                return purchaseDB.deletePurchaseTransaction(data);
            }),            

            global.share.ipcMain.handle('delete-purchase-entry', async (_, data) => {
                return purchaseDB.deletePurchaseEntry(data);
            })
    ]
    }