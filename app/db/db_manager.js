"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaleTransaction = exports.insertSaleTransaction = exports.deleteSaleTransaction = exports.getSaleTransactionByID = exports.getAllSaleTransactions = exports.updateSale = exports.insertSale = exports.deleteSale = exports.getSaleByID = exports.getAllSales = exports.deleteProduct = exports.updateProduct = exports.inserProduct = exports.getProductByID = exports.getAllProducts = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const items_schema_1 = require("./data/models/items.schema");
const products_db_manager_1 = require("./products_db_manager");
Object.defineProperty(exports, "getAllProducts", { enumerable: true, get: function () { return products_db_manager_1.getAllProducts; } });
Object.defineProperty(exports, "getProductByID", { enumerable: true, get: function () { return products_db_manager_1.getProductByID; } });
Object.defineProperty(exports, "inserProduct", { enumerable: true, get: function () { return products_db_manager_1.inserProduct; } });
Object.defineProperty(exports, "updateProduct", { enumerable: true, get: function () { return products_db_manager_1.updateProduct; } });
Object.defineProperty(exports, "deleteProduct", { enumerable: true, get: function () { return products_db_manager_1.deleteProduct; } });
const sales_db_manager_1 = require("./sales_db_manager");
Object.defineProperty(exports, "getAllSales", { enumerable: true, get: function () { return sales_db_manager_1.getAllSales; } });
Object.defineProperty(exports, "getSaleByID", { enumerable: true, get: function () { return sales_db_manager_1.getSaleByID; } });
Object.defineProperty(exports, "deleteSale", { enumerable: true, get: function () { return sales_db_manager_1.deleteSale; } });
Object.defineProperty(exports, "insertSale", { enumerable: true, get: function () { return sales_db_manager_1.insertSale; } });
Object.defineProperty(exports, "updateSale", { enumerable: true, get: function () { return sales_db_manager_1.updateSale; } });
Object.defineProperty(exports, "getAllSaleTransactions", { enumerable: true, get: function () { return sales_db_manager_1.getAllSaleTransactions; } });
Object.defineProperty(exports, "getSaleTransactionByID", { enumerable: true, get: function () { return sales_db_manager_1.getSaleTransactionByID; } });
Object.defineProperty(exports, "deleteSaleTransaction", { enumerable: true, get: function () { return sales_db_manager_1.deleteSaleTransaction; } });
Object.defineProperty(exports, "insertSaleTransaction", { enumerable: true, get: function () { return sales_db_manager_1.insertSaleTransaction; } });
Object.defineProperty(exports, "updateSaleTransaction", { enumerable: true, get: function () { return sales_db_manager_1.updateSaleTransaction; } });
const AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [items_schema_1.Product, items_schema_1.Sales, items_schema_1.SaleTransactions],
});
exports.AppDataSource = AppDataSource;
AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
//# sourceMappingURL=db_manager.js.map