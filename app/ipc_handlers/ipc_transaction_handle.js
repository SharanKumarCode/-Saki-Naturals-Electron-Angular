const {transactionDB} = require('../db/db_manager')

module.exports = {
    transactionHandler: [
            global.share.ipcMain.handle('get-transaction-types', async () => {
                return transactionDB.getAllTransactionTypes();
            }),

            global.share.ipcMain.handle('insert-transaction-type', async (_, data) => {
              return transactionDB.insertTransactionType(data);
            }),
        
            global.share.ipcMain.handle('hard-delete-transaction-type', async (_, data) => {
                return transactionDB.hardDeleteTransactionType(data);
            }),

            global.share.ipcMain.handle('soft-delete-transaction-type', async (_, data) => {
                return transactionDB.softDeleteTransactionType(data);
            }),
        
            global.share.ipcMain.handle('get-transaction-by-type-id', async (_, data) => {
                return transactionDB.getTransactionEntryByTransactionTypeID(data);
            }),

            global.share.ipcMain.handle('get-transaction-entries', async () => {
                return transactionDB.getAllTransactionEntries();
            }),

            global.share.ipcMain.handle('insert-transaction-entry', async (_, data) => {
                return transactionDB.insertTransactionEntry(data);
            }),

            global.share.ipcMain.handle('update-transaction-entry', async (_, data) => {
                return transactionDB.updateTransactionEntry(data);
            }),

            global.share.ipcMain.handle('delete-transaction-entry', async (_, data) => {
                return transactionDB.deleteTransactionEntry(data);
            }),
    ]
    }