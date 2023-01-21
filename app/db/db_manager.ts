
import { DataSource } from "typeorm";

import {
    Client,
        Company,
        Employee,
        EmployeeTransaction,
        Material,
        Product,
        ProductGroup,
        SaleEntry,
        SaleTransaction,
        Sales,
        Purchase,
        PurchaseEntry,
        PurchaseTransaction
        } from "./data/models/items.schema";


import * as productsDB from './products_db_manager';
import * as salesDB from './sales_db_manager';
import * as clientDB from './clients_db_manager';
import * as materialDB from './materials_db_manager';
import * as purchaseDB from './purchase_db_manager';


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
        Client,
        Company,
        Employee,
        EmployeeTransaction,
        Purchase,
        PurchaseEntry,
        PurchaseTransaction ],
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
    salesDB,
    clientDB,
    materialDB,
    purchaseDB
}