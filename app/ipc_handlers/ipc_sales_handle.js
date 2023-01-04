const { 
  dummyFunc,
  getAllSales, 
  getSaleByID, 
  deleteSale, 
  insertSale, 
  updateSale, 
  getAllSaleTransactions,
  getSaleTransactionByID,
  deleteSaleTransaction,
  insertSaleTransaction,
  updateSaleTransaction } = require('../db/db_manager')

module.exports = {
    salesHandler: [
            global.share.ipcMain.handle('get-sales', async () => {
                return getAllSales();
            }),

            global.share.ipcMain.handle('get-sale-by-id', async (_, data) => {
              return getSaleByID(data);
          }),
        
            global.share.ipcMain.handle('insert-sale', async (_, data) => {
                return insertSale(data);
            }),
        
            global.share.ipcMain.handle('delete-sale', async (_, data) => {
                return deleteSale(data);
            }),
            
            global.share.ipcMain.handle('update-sale', async (_, data) => {
                return updateSale(data);
            }),

            global.share.ipcMain.handle('get-sales-transaction', async () => {
              return getAllSaleTransactions();
            }),

            global.share.ipcMain.handle('get-sales-transaction-by-id', async (_, data) => {
              return getSaleTransactionByID(data);
            }),
        
            global.share.ipcMain.handle('insert-sale-transaction', async (_, data) => {
                return insertSaleTransaction(data);
            }),
        
            global.share.ipcMain.handle('delete-sale-transaction', async (_, data) => {
                return deleteSaleTransaction(data);
            }),
            
            global.share.ipcMain.handle('update-sale-transaction', async (_, data) => {
                return updateSaleTransaction(data);
            }),
    ]
    }