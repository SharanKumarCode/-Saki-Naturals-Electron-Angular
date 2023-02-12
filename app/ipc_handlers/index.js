const { salesHandler } = require('./ipc_sales_handle');
const { productsHandler } =require('./ipc_products_handle');
const { clientsHandler } = require('./ipc_client_handle');
const { materialsHandler } = require('./ipc_materials_handle');
const { purchaseHandler } = require('./ipc_purchase_handle');
const { productionHandler } = require('./ipc_production_handle');
const { employeeHandler } = require('./ipc_employee_handle');
const { companyHandler } = require('./ipc_company_handle');
const { transactionHandler } = require('./ipc_transaction_handle');
const { stockSoldConsumedHandler } = require('./ipc_stock_sold_consumed_handle');

module.exports = {
    exports: [
        salesHandler, 
        productsHandler, 
        clientsHandler, 
        materialsHandler, 
        purchaseHandler, 
        productionHandler,
        employeeHandler,
        companyHandler,
        transactionHandler,
        stockSoldConsumedHandler]
}