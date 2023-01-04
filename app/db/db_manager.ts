
import { DataSource } from "typeorm";

import {
    Client,
        Company,
        Employee,
        EmployeeTransaction,
        Product,
        ProductGroup,
        SaleEntry,
        SaleTransaction,
        Sales
        } from "./data/models/items.schema";


import * as productsDB from './products_db_manager';
import * as salesDB from './sales_db_manager';
import * as clientDB from './clients_db_manager';


const AppDataSource = new DataSource({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [ Product,
        ProductGroup,
        Sales, 
        SaleEntry, 
        SaleTransaction,
        Client,
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
    salesDB,
    clientDB
}