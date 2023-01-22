const {productionDB} = require('../db/db_manager')

module.exports = {
    productionHandler: [
            global.share.ipcMain.handle('get-production', async () => {
                return productionDB.getAllProduction();
            }),

            global.share.ipcMain.handle('get-production-by-id', async (_, data) => {
              return productionDB.getProductionByID(data);
            }),
        
            global.share.ipcMain.handle('insert-production', async (_, data) => {
                return productionDB.insertProduction(data);
            }),

            global.share.ipcMain.handle('update-production', async (_, data) => {
                return productionDB.updateProduction(data);
            }),

            global.share.ipcMain.handle('soft-delete-production', async (_, data) => {
                return productionDB.softDeleteProduction(data);
            }),   
        
            global.share.ipcMain.handle('delete-production', async (_, data) => {
                return productionDB.deleteProduction(data);
            }),                      

            global.share.ipcMain.handle('delete-production-entry', async (_, data) => {
                return productionDB.deleteProductionEntry(data);
            })
    ]
    }