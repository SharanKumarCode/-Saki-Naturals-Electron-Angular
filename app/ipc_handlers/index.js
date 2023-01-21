const { salesHandler } = require('./ipc_sales_handle');
const { productsHandler } =require('./ipc_products_handle');
const { clientsHandler } = require('./ipc_client_handle');
const { materialsHandler } = require('./ipc_materials_handle');
const { purchaseHandler } = require('./ipc_purchase_handle');

module.exports = {
    exports: [salesHandler, productsHandler, clientsHandler, materialsHandler, purchaseHandler]
}