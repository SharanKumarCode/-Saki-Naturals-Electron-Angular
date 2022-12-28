const {salesDB} = require('../db/db_manager')

module.exports = {
    salesHandler: [
            global.share.ipcMain.handle('get-sales', async () => {
                return salesDB.getAllSales();
            }),

            global.share.ipcMain.handle('get-sale-by-id', async (_, data) => {
              return salesDB.getSaleByID(data);
          }),
        
            global.share.ipcMain.handle('insert-sale', async (_, data) => {
                return salesDB.insertSale(data);
            }),
        
            global.share.ipcMain.handle('delete-sale', async (_, data) => {
                return salesDB.deleteSale(data);
            }),
            
            global.share.ipcMain.handle('update-sale', async (_, data) => {
                return salesDB.updateSale(data);
            }),

            global.share.ipcMain.handle('get-sales-transaction', async () => {
              return salesDB.getAllSaleTransactions();
            }),

            global.share.ipcMain.handle('get-sales-transaction-by-id', async (_, data) => {
              return salesDB.getSaleTransactionByID(data);
            }),
        
            global.share.ipcMain.handle('insert-sale-transaction', async (_, data) => {
                return salesDB.insertSaleTransaction(data);
            }),
        
            global.share.ipcMain.handle('delete-sale-transaction', async (_, data) => {
                return salesDB.deleteSaleTransaction(data);
            }),
            
            global.share.ipcMain.handle('update-sale-transaction', async (_, data) => {
                return salesDB.updateSaleTransaction(data);
            }),
    ]
    }