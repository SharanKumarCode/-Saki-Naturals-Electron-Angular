import { AppDataSource } from './db_manager';
import { Product, ProductGroup } from "./data/models/items.schema"
import { IProductData, IProductGroup } from '../../src/app/core/interfaces/interfaces';

async function getAllProducts(){
    console.log('INFO : Getting all products')
    const res = await AppDataSource.manager
                    .getRepository(Product).find(
                        {
                            relations: {
                                productGroup: true,
                            }
                        }
                    )
    return res
}

async function getProductByID(productID: string){
    console.log('INFO : Getting product by ID')
    const res = await AppDataSource.getRepository(Product).find(
        {
            where: {
                productID: productID
            },
            relations: {
                productGroup: true
            }
        }
    )

    return res
}

async function getProductByProductGroupID(productGroupID: string){
    console.log('INFO : Getting product by Group ID')
    const productGroupEntity = new ProductGroup()
    productGroupEntity.productGroupID = productGroupID

    const res = await AppDataSource.getRepository(Product).find(
        {
            where: {
                productGroup: productGroupEntity
            }
        }
    )

    return res
}

async function insertProduct(product: IProductData){
    console.log("INFO: Inserting product data")
    const productGroupEntity = new ProductGroup()
    productGroupEntity.productGroupID = product.productGroupID
    productGroupEntity.productGroupName = product.productGroupName

    const res = await AppDataSource.manager.insert(Product, {
        productGroup: productGroupEntity,
        productName: product.productName,
        description: product.description,
        priceDirectSale: product.priceDirectSale,
        priceReseller: product.priceReseller,
        priceDealer: product.priceDealer,
        remarks: product.remarks
    })
    return res
}

async function updateProduct(product: IProductData){
    console.log("INFO: Updating product data")
    const productGroupEntity = new ProductGroup()
    productGroupEntity.productGroupID = product.productGroupID
    productGroupEntity.productGroupName = product.productGroupName

    const res = await AppDataSource.manager.update(Product, {
        productID: product.productID
    }, {
        productGroup: productGroupEntity,
        productName: product.productName,
        description: product.description,
        priceDirectSale: product.priceDirectSale,
        priceReseller: product.priceReseller,
        priceDealer: product.priceDealer,
        remarks: product.remarks
    })
    return res
}

async function softDeleteProduct(productID: string){
    console.log("INFO: Soft deleting product by ID")
    const res = await AppDataSource.manager.update(Product, {
        productID: productID
    }, {
        deleteFlag: true
    })
    return res
}

async function hardDeleteProduct(productID: string){
    console.log("INFO: Hard deleting product data")
    const res = await AppDataSource.manager.delete(Product, {
        productID: productID
    })
    return res
}

async function getAllProductGroups() {
    console.log('INFO : Getting all product groups')
    const res = await AppDataSource.manager
                    .createQueryBuilder(ProductGroup, "productGroup")
                    .getMany()
    return res
}

async function insertProductGroup(productGroupData: IProductGroup) {
    console.log('INFO : Inserting product group')
    const res = await AppDataSource.manager.insert(ProductGroup, {
        productGroupName: productGroupData.productGroupName,
    })
    return res
}

async function softDeleteProductGroup(productGroupID: string){
    console.log("INFO: Soft deleting product group by ID")
    const res = await AppDataSource.manager.update(ProductGroup, {
        productGroupID: productGroupID
    }, {
        deleteFlag: true
    })
    return res
}

async function hardDeleteProductGroup(productGroupID: string){
    console.log("INFO: Hard deleting product group")
    const res = await AppDataSource.manager.delete(ProductGroup, {
        productGroupID: productGroupID
    })
    return res
}

export { getAllProducts, 
        getProductByID,
        getProductByProductGroupID, 
        insertProduct, 
        updateProduct, 
        softDeleteProduct, 
        hardDeleteProduct, 
        getAllProductGroups,
        insertProductGroup, 
        softDeleteProductGroup, 
        hardDeleteProductGroup }