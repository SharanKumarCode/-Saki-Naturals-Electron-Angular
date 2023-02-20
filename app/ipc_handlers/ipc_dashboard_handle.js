const {dashboardDB} = require('../db/db_manager')

module.exports = {
    dashboardHandler: [
            global.share.ipcMain.handle('get-all-transactions-dashboard', async () => {
                return dashboardDB.getAllTransactionsDashboard();
            })
    ]
    }