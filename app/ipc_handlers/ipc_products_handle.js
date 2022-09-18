const { getAllProducts, getProductByID, inserProduct, softDeleteProduct, hardDeleteProduct, updateProduct } = require('../db/db_manager')

module.exports = {
    productsHandler: [
            global.share.ipcMain.handle('get-products', async () => {
                return getAllProducts();
            }),

            global.share.ipcMain.handle('get-product-by-id', async (_, data) => {
                return getProductByID(data);
            }),
        
            global.share.ipcMain.handle('insert-product', async (_, data) => {
                return inserProduct(data);
            }),
        
            global.share.ipcMain.handle('soft-delete-product', async (_, data) => {
                return softDeleteProduct(data);
            }),

            global.share.ipcMain.handle('hard-delete-product', async (_, data) => {
                return hardDeleteProduct(data);
            }),
            
            global.share.ipcMain.handle('update-product', async (_, data) => {
                return updateProduct(data);
            }),
    ]
    }