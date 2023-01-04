const { materialDB } = require('../db/db_manager')

module.exports = {
    clientsHandler: [
            global.share.ipcMain.handle('get-materials', async () => {
                return materialDB.getAllMaterials();
            }),

            global.share.ipcMain.handle('get-material-by-id', async (_, data) => {
                return materialDB.getMaterialByID(data);
            }),
        
            global.share.ipcMain.handle('insert-material', async (_, data) => {
                return materialDB.insertMaterial(data);
            }),

            global.share.ipcMain.handle('update-material', async (_, data) => {
                return materialDB.updateMaterial(data);
            }),
        
            global.share.ipcMain.handle('soft-delete-material', async (_, data) => {
                return materialDB.softDeleteMaterial(data);
            }),

            global.share.ipcMain.handle('hard-delete-material', async (_, data) => {
                return materialDB.hardDeleteMaterial(data);
            })
    ]
    }