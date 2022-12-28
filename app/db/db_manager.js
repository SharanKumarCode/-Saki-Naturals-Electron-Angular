"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesDB = exports.productsDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const items_schema_1 = require("./data/models/items.schema");
const productsDB = require("./products_db_manager");
exports.productsDB = productsDB;
const salesDB = require("./sales_db_manager");
exports.salesDB = salesDB;
const AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [items_schema_1.Product,
        items_schema_1.ProductGroup,
        items_schema_1.Material,
        items_schema_1.Sales,
        items_schema_1.SaleEntry,
        items_schema_1.SaleTransaction,
        items_schema_1.Production,
        items_schema_1.ProductionEntry,
        items_schema_1.Purchase,
        items_schema_1.PurchaseEntry,
        items_schema_1.PurchaseTransaction,
        items_schema_1.Customer,
        items_schema_1.Supplier,
        items_schema_1.Company,
        items_schema_1.Employee,
        items_schema_1.EmployeeTransaction],
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