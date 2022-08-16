const { getAllProducts, inserProduct, deleteProduct, updateProduct } = require('../db/db_manager')

module.exports = {
    productsHandler: [
            global.share.ipcMain.handle('get-products', async () => {
                return getAllProducts();
            }),
        
            global.share.ipcMain.handle('insert-product', async (_, data) => {
                return inserProduct(data);
            }),
        
            global.share.ipcMain.handle('delete-product', async (_, data) => {
                return deleteProduct(data);
            }),
            
            global.share.ipcMain.handle('update-product', async (_, data) => {
                return updateProduct(data);
            }),
    ]
    }