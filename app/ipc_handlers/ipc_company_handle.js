const {companyDB} = require('../db/db_manager')

module.exports = {
    companyHandler: [
            global.share.ipcMain.handle('get-company', async () => {
                return companyDB.getCompany();
            }),

            global.share.ipcMain.handle('get-company-by-id', async (_, data) => {
              return companyDB.getCompanyByID(data);
            }),
        
            global.share.ipcMain.handle('initialise-company', async (_, data) => {
                return companyDB.initialiseCompany(data);
            }),

            global.share.ipcMain.handle('update-company', async (_, data) => {
                return companyDB.updateCompany(data);
            })
    ]
    }