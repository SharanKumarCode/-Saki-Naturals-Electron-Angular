import { randomUUID } from "crypto"
import { DataSource } from "typeorm"
import { Product } from "./data/models/items.schema"

const AppDataSource = new DataSource({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [ Product ],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

async function getProducts(){
    console.log('getting products..')
    // const res = await AppDataSource.manager.find(Product,{})
    const res = await AppDataSource.manager
    .createQueryBuilder(Product, "product")
    .where("product_id = :id", { id: 3 })
    .getOne()
    if (!res){
        console.log("product result is empty")
        // populateProductsDummyData()
    }
    console.log(res)
    return res
}

async function populateProductsDummyData(){
    console.log("populating with dummy data")
    const res = await AppDataSource.manager.insert(Product,{
        group: "Soap",
        product_name: "Timber",
        description: "dummy",
        stock: 10,
        price_directSale: 20.0,
        price_reseller: 40.0,
        price_dealer: 30.0,
        created_date: Date.now().toLocaleString(),
        sold: 690
    }).then(data=>{
        console.log("inserted dummy data : "+data.generatedMaps.toString())
    }).catch(e=>{
        console.log("error while inserting into table : " + e)
    })
}

export {AppDataSource, getProducts}