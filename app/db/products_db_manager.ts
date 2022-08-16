import { AppDataSource } from './db_manager';
import { IProductData } from "../../src/app/products/interfaces/productdata.interface";
import { Product } from "./data/models/items.schema"

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

export { getAllProducts, inserProduct, updateProduct, deleteProduct}