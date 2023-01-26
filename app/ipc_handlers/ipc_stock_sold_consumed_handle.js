const {stockSoldConsumedDB} = require('../db/db_manager')

module.exports = {
    stockSoldConsumedHandler: [
            global.share.ipcMain.handle('get-product-stock-sold-by-id', async (_, data) => {
                return stockSoldConsumedDB.getProductStockAndSoldByID(data);
            })
    ]
    }