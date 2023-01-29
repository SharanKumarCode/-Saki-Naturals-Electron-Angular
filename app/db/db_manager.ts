
import { DataSource } from "typeorm";

import {
        Client,
        Company,
        Material,
        Product,
        ProductGroup,
        SaleEntry,
        SaleTransaction,
        Sales,
        Purchase,
        PurchaseEntry,
        PurchaseTransaction,
        Production,
        ProductionEntry
        } from "./data/models/items.schema";


import {
        Employee,
        AttendanceEntry,
        SalaryTransaction,
        } from "./data/models/employee-items.schema";

import * as productsDB from './products_db_manager';
import * as salesDB from './sales_db_manager';
import * as clientDB from './clients_db_manager';
import * as materialDB from './materials_db_manager';
import * as purchaseDB from './purchase_db_manager';
import * as productionDB from './production_db_manager';
import * as employeeDB from './employee_db_manager';
import * as stockSoldConsumedDB from './stock_sold_consumed_db_manager';

import {existsSync} from 'fs';

let synchroniseFlag = existsSync(`app/db/data/saki_naturals_db.db`) ? false : true;
console.log(synchroniseFlag)

const AppDataSource = new DataSource({
    type: 'sqlite',
    synchronize: synchroniseFlag,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [ 
        Product,
        ProductGroup,
        Material,
        Sales, 
        SaleEntry, 
        SaleTransaction,
        Client,
        Company,
        Purchase,
        PurchaseEntry,
        PurchaseTransaction,
        Production,
        ProductionEntry,
        AttendanceEntry,
        SalaryTransaction,
        Employee
         ],
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
    purchaseDB,
    productionDB,
    employeeDB,
    stockSoldConsumedDB
}