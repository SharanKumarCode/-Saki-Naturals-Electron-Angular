import { DataSource } from "typeorm";

import { Product,
        ProductGroup, 
        Material, 
        Sales, 
        SaleEntry, 
        SaleTransaction, 
        Production,
        ProductionEntry,
        Purchase,
        PurchaseEntry,
        PurchaseTransaction,
        Customer,
        Supplier,
        Company,
        Employee,
        EmployeeTransaction
        } from "./data/models/items.schema";
import * as productsDB from './products_db_manager';
import * as salesDB from './sales_db_manager';

const AppDataSource = new DataSource({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [ Product,
        ProductGroup,
        Material, 
        Sales, 
        SaleEntry, 
        SaleTransaction, 
        Production,
        ProductionEntry,
        Purchase,
        PurchaseEntry,
        PurchaseTransaction,
        Customer,
        Supplier,
        Company,
        Employee,
        EmployeeTransaction ],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

export {
    AppDataSource,
    productsDB,
    salesDB
}