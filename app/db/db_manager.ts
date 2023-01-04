import { DataSource } from "typeorm";

import { Product, Purchaser, SaleEntry, Sales, SaleTransactions, Supplier } from "./data/models/items.schema";
import * as productsDB from './products_db_manager';
import * as salesDB from './sales_db_manager';

const AppDataSource = new DataSource({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [ Product, Sales, SaleTransactions, Purchaser, Supplier, SaleEntry ],
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