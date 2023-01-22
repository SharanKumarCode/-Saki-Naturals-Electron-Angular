import { IProductionData, IProductionEntry } from "../../src/app/core/interfaces/interfaces";
import { Material, Product, Production, ProductionEntry } from "./data/models/items.schema";
import { AppDataSource } from "./db_manager";

async function getAllProduction(){
    console.log('INFO : Getting production data')

    const res = await AppDataSource.getRepository(Production).find(
        {
            relations: {
                productionEntries: {
                    material: true
                },
                product: {
                    productGroup: true
                }
        }
        }
    )

    return res
}

async function getProductionByID(productionID: string){
    console.log("INFO : Getting production data by ID")
    const res = await AppDataSource.getRepository(Production).find(
        {
            relations: {
                productionEntries: {
                    material: true
                },
                product: {
                    productGroup: true
                }
        },
            where: {
                productionID: productionID
            }
        }
    )

    return res
}

async function softDeleteProduction(productionID: string){
    console.log("INFO: Soft deleting production by ID")
    const res = await AppDataSource.manager.update(Production, {
        productionID: productionID
    }, {
        deleteFlag: true
    })
    return res
}

async function unDeleteProduction(productionID: string){
    console.log("INFO: reverting deleted production by ID")
    const res = await AppDataSource.manager.update(Production, {
        productionID: productionID
    }, {
        deleteFlag: false
    })
    return res
}


async function deleteProduction(productionID: string){
    console.log("INFO: Hard deleting production by ID")
    const res = await AppDataSource.manager.delete(Production, {
        productionID: productionID
    })
    return res
}

async function insertProduction(productionData: IProductionData){
    console.log("INFO: Inserting production data")

    var productEntity = new Product()
    const ignoreProducttPropList = ['editCreate', 'deleteFlag', 'createdDate']
    for (let index = 0; index < Object.keys(productionData.product).length; index++) {
        if (!(ignoreProducttPropList.includes(Object.keys(productionData.product)[index]))) {
            productEntity[Object.keys(productionData.product)[index]] = productionData.product[Object.keys(productionData.product)[index]];
        }
    }
    
    const productionEntity = new Production()
    productionEntity.productionDate = productionData.productionDate
    productionEntity.remarks = productionData.remarks
    productionEntity.productQuantity = productionData.productQuantity
    productionEntity.product = productEntity
    
    const res = await AppDataSource.getRepository(Production).save(productionEntity)

    for (let index = 0; index < productionData.productionEntries.length; index++) {
        const element = productionData.productionEntries[index];

        const materialEntity = new Material()
        materialEntity.description = element.material.description
        materialEntity.materialID = element.material.materialID
        materialEntity.materialName = element.material.materialName
        materialEntity.remarks = element.material.remarks

        const productionEntryEntity = new ProductionEntry()
        productionEntryEntity.materialQuantity = element.materialQuantity
        productionEntryEntity.material = materialEntity
        productionEntryEntity.production = productionEntity

        await AppDataSource.getRepository(ProductionEntry).save(productionEntryEntity)
        
    }

    return res
}

async function updateProduction(productionData: IProductionData){
    console.log("INFO : Updating production data")

    var productEntity = new Product()
    const ignoreProducttPropList = ['editCreate', 'deleteFlag', 'createdDate']
    for (let index = 0; index < Object.keys(productionData.product).length; index++) {
        if (!(ignoreProducttPropList.includes(Object.keys(productionData.product)[index]))) {
            productEntity[Object.keys(productionData.product)[index]] = productionData.product[Object.keys(productionData.product)[index]];
        }
        
    }

    const productionEntity = new Production()
    productionEntity.productionID = productionData.productionID
    productionEntity.product = productEntity
    productionEntity.productionDate = productionData.productionDate
    productionEntity.remarks = productionData.remarks
    productionEntity.productQuantity = productionData.productQuantity

    productionEntity.cancelledDate = productionData.cancelledDate
    productionEntity.completedDate = productionData.completedDate
    
    const res = await AppDataSource.manager.update(Production,
        {
            productionID: productionData.productionID
        },
        {
            ...productionEntity
    })

    for (let index = 0; index < productionData.productionEntries.length; index++) {
        const element = productionData.productionEntries[index];

        const materialEntity = new Material()
        materialEntity.description = element.material.description
        materialEntity.materialID = element.material.materialID
        materialEntity.materialName = element.material.materialName
        materialEntity.remarks = element.material.remarks

        const productionEntryEntity = new ProductionEntry()
        productionEntryEntity.materialQuantity = element.materialQuantity
        productionEntryEntity.material = materialEntity
        productionEntryEntity.production = productionEntity

        if (element.productionEntryID === undefined) {
            productionEntryEntity.productionEntryID = element.productionEntryID
            await AppDataSource.getRepository(ProductionEntry).save(productionEntryEntity)
        } else {
            await AppDataSource.getRepository(ProductionEntry).update({
                productionEntryID: element.productionEntryID
            },{
                ...productionEntryEntity
            })
        }       
    }
    
    return res
}


async function insertProductionEntry(productionEntryList: IProductionEntry[]) {
    console.log("INFO : Inserting production entry data")
    return await AppDataSource
                        .createQueryBuilder()
                        .insert()
                        .into(ProductionEntry)
                        .values(productionEntryList)
                        .execute()
}


async function deleteProductionEntry(productionEntry) {
    console.log("INFO : Deleting production entry data")
    return await AppDataSource
                    .getRepository(ProductionEntry)
                    .delete(productionEntry)
    
}

export {
    getAllProduction, 
    getProductionByID,
    insertProduction, 
    updateProduction, 
    softDeleteProduction, 
    deleteProduction,
    insertProductionEntry,
    deleteProductionEntry
}