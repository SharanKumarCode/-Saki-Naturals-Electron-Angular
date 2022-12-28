const { clientDB } = require('../db/db_manager')

module.exports = {
    clientsHandler: [
            global.share.ipcMain.handle('get-clients', async () => {
                return clientDB.getAllClients();
            }),

            global.share.ipcMain.handle('get-client-by-id', async (_, data) => {
                return clientDB.getClientByID(data);
            }),
        
            global.share.ipcMain.handle('insert-client', async (_, data) => {
                return clientDB.insertClient(data);
            }),

            global.share.ipcMain.handle('update-client', async (_, data) => {
                return clientDB.updateClient(data);
            }),
        
            global.share.ipcMain.handle('soft-delete-client', async (_, data) => {
                return clientDB.softDeleteClient(data);
            }),

            global.share.ipcMain.handle('hard-delete-client', async (_, data) => {
                return clientDB.hardDeleteClient(data);
            })
    ]
    }