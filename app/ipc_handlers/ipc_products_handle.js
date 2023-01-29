const { productsDB } = require('../db/db_manager')

module.exports = {
    productsHandler: [
            global.share.ipcMain.handle('check-for-updates', async () => {
                return productsDB.checkForAppUpdates();
            }),

            global.share.ipcMain.handle('get-app-version', async () => {
                return productsDB.getAppVersion();
            }),

            global.share.ipcMain.handle('get-products', async () => {
                return productsDB.getAllProducts();
            }),

            global.share.ipcMain.handle('get-product-by-id', async (_, data) => {
                return productsDB.getProductByID(data);
            }),

            global.share.ipcMain.handle('get-product-by-group-id', async (_, data) => {
                return productsDB.getProductByProductGroupID(data);
            }),
        
            global.share.ipcMain.handle('insert-product', async (_, data) => {
                return productsDB.insertProduct(data);
            }),
        
            global.share.ipcMain.handle('soft-delete-product', async (_, data) => {
                return productsDB.softDeleteProduct(data);
            }),

            global.share.ipcMain.handle('hard-delete-product', async (_, data) => {
                return productsDB.hardDeleteProduct(data);
            }),
            
            global.share.ipcMain.handle('update-product', async (_, data) => {
                return productsDB.updateProduct(data);
            }),
    
            global.share.ipcMain.handle('get-product-groups', async () => {
                return productsDB.getAllProductGroups();
            }),

            global.share.ipcMain.handle('insert-product-group', async (_, data) => {
                return productsDB.insertProductGroup(data);
            }),

            global.share.ipcMain.handle('soft-delete-product-group', async (_, data) => {
                return productsDB.softDeleteProductGroup(data);
            }),

            global.share.ipcMain.handle('hard-delete-product-group', async (_, data) => {
                return productsDB.hardDeleteProductGroup(data);
            })
    ]
    }