const { salesHandler } = require('./ipc_sales_handle');
const { productsHandler } =require('./ipc_products_handle');

module.exports = {
    exports: [salesHandler, productsHandler]
}