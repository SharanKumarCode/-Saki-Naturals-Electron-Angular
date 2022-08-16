import { DataSource } from "typeorm"

import { Product, Sales, SaleTransactions } from "./data/models/items.schema"
import { getAllProducts, inserProduct, updateProduct, deleteProduct } from './products_db_manager'

const AppDataSource = new DataSource({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [ Product, Sales, SaleTransactions ],
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
    getAllProducts,
    inserProduct,
    updateProduct,
    deleteProduct
}