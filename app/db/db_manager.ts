import { randomUUID } from "crypto"
import { delay } from "rxjs"
import { DataSource } from "typeorm"
import { IProductData } from "../../src/app/products/interfaces/productdata.interface"
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

async function getAllProducts(){
    console.log('getting products..')
    const res = await AppDataSource.manager
    .createQueryBuilder(Product, "product")
    .getMany()
    return res
}

async function inserProduct(product: IProductData){
    console.log("Inserting product data..")
    const res = await AppDataSource.manager.insert(Product, {
        group: product.group,
        product_name: product.productName,
        description: product.description,
        stock: product.stock,
        price_directSale: product.priceDirectSale,
        price_reseller: product.priceReseller,
        price_dealer: product.priceDealer,
        created_date: product.createdDate,
        sold: product.sold
    })
    return res
}

async function updateProduct(product: any){
    console.log("Updating product data..")
    const res = await AppDataSource.manager.update(Product, {
        product_id: product.productID
    }, {
        group: product.group,
        product_name: product.productName,
        description: product.description,
        stock: product.stock,
        price_directSale: product.priceDirectSale,
        price_reseller: product.priceReseller,
        price_dealer: product.priceDealer,
        created_date: product.createdDate,
        sold: product.sold
    })
    return res
}

async function deleteProduct(product_ID: string){
    console.log("Deleting product data..")
    const res = await AppDataSource.manager.delete(Product, {
        product_id: product_ID
    })
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

export {AppDataSource, getAllProducts, inserProduct, updateProduct, deleteProduct}