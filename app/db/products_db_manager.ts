import { AppDataSource } from './db_manager';
import { IProductData } from "../../src/app/products/interfaces/productdata.interface";
import { Product } from "./data/models/items.schema"

async function getAllProducts(){
    console.log('INFO : Getting all products..')
    const res = await AppDataSource.manager
    .createQueryBuilder(Product, "product")
    .getMany()
    return res
}

async function getProductByID(productID: string){
    console.log('INFO : Getting product by ID')
    const res = await AppDataSource.getRepository(Product).find(
        {
            where: {
                productID: productID
            }
        }
    )

    return res
}

async function insertProduct(product: IProductData){
    console.log("INFO: Inserting product data..")
    const res = await AppDataSource.manager.insert(Product, {
        productGroup: product.group,
        productName: product.productName,
        description: product.description,
        priceDirectSale: product.priceDirectSale,
        priceReseller: product.priceReseller,
        priceDealer: product.priceDealer,
        createdDate: product.createdDate,
        remarks: product.remarks
    })
    return res
}

async function updateProduct(product: any){
    console.log("INFO: Updating product data..")
    const res = await AppDataSource.manager.update(Product, {
        product_id: product.productID
    }, {
        productGroup: product.group,
        productName: product.productName,
        description: product.description,
        priceDirectSale: product.priceDirectSale,
        priceReseller: product.priceReseller,
        priceDealer: product.priceDealer,
        createdDate: product.createdDate
    })
    return res
}

async function softDeleteProduct(product_ID: string){
    console.log("INFO: Soft deleting product by ID..")
    const res = await AppDataSource.manager.update(Product, {
        product_id: product_ID
    }, {
        deleteFlag: true
    })
    return res
}

async function hardDeleteProduct(product_ID: string){
    console.log("INFO: Hard deleting product data..")
    const res = await AppDataSource.manager.delete(Product, {
        product_id: product_ID
    })
    return res
}

export { getAllProducts, getProductByID, insertProduct, updateProduct, softDeleteProduct, hardDeleteProduct }