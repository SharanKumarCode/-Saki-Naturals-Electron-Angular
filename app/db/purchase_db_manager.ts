import { IPurchaseData, IPurchaseEntry, IPurchaseTransactions } from "../../src/app/core/interfaces/interfaces";
import { Client, Material, Purchase, PurchaseEntry, PurchaseTransaction } from "./data/models/items.schema";
import { AppDataSource } from "./db_manager";

async function getAllPurchase(){
    console.log('INFO : Getting purchase data')

    const res = await AppDataSource.getRepository(Purchase).find(
        {
            relations: {
                supplier: true,
                purchaseEntries: {
                    material: true
                },
                purchaseTransactions: true
        }
        }
    )

    return res
}

async function getPurchaseByID(purchaseID: string){
    console.log("INFO : Getting purchase data by ID")
    const res = await AppDataSource.getRepository(Purchase).find(
        {
            relations: {
                supplier: true,
                purchaseEntries: {
                    material: true
                },
                purchaseTransactions: true
        },
            where: {
                purchaseID: purchaseID
            }
        }
    )

    return res
}

async function softDeletePurchase(purchaseID: string){
    console.log("INFO: Soft deleting purchase by ID")
    const res = await AppDataSource.manager.update(Purchase, {
        purchaseID: purchaseID
    }, {
        deleteFlag: true
    })
    return res
}

async function unDeletePurchase(purchaseID: string){
    console.log("INFO: reverting deleted purchase by ID")
    const res = await AppDataSource.manager.update(Purchase, {
        purchaseID: purchaseID
    }, {
        deleteFlag: false
    })
    return res
}


async function deletePurchase(purchaseID: string){
    console.log("INFO: Hard deleting purchase by ID")
    const res = await AppDataSource.manager.delete(Purchase, {
        purchaseID: purchaseID
    })
    return res
}

async function insertPurchase(purchaseData: IPurchaseData){
    console.log("INFO: Inserting purchase and transaction data..")

    var clientEntity = new Client()
    const ignoreClientPropList = ['editCreate', 'deleteFlag', 'createdDate']
    for (let index = 0; index < Object.keys(purchaseData.supplier).length; index++) {
        if (!(ignoreClientPropList.includes(Object.keys(purchaseData.supplier)[index]))) {
            clientEntity[Object.keys(purchaseData.supplier)[index]] = purchaseData.supplier[Object.keys(purchaseData.supplier)[index]];
        }
        
    }
    
    const purchaseEntity = new Purchase()
    purchaseEntity.supplier = clientEntity
    purchaseEntity.purchaseDate = purchaseData.purchaseDate
    purchaseEntity.remarks = purchaseData.remarks

    purchaseEntity.gstPercentage = purchaseData.gstPercentage
    purchaseEntity.overallDiscountPercentage = purchaseData.overallDiscountPercentage
    purchaseEntity.transportCharges = purchaseData.transportCharges
    purchaseEntity.miscCharges = purchaseData.miscCharges
    purchaseEntity.paymentTerms = purchaseData.paymentTerms

    purchaseEntity.dispatchDate= purchaseData.dispatchDate
    purchaseEntity.deliveredDate= purchaseData.deliveredDate
    purchaseEntity.completedDate= purchaseData.completedDate
    
    const res = await AppDataSource.getRepository(Purchase).save(purchaseEntity)

    for (let index = 0; index < purchaseData.purchaseEntries.length; index++) {
        const element = purchaseData.purchaseEntries[index];

        const materialEntity = new Material()
        materialEntity.description = element.material.description
        materialEntity.materialID = element.material.materialID
        materialEntity.materialName = element.material.materialName
        materialEntity.remarks = element.material.remarks

        const purchaseEntryEntity = new PurchaseEntry()
        purchaseEntryEntity.price = element.price
        purchaseEntryEntity.quantity = element.quantity
        purchaseEntryEntity.discountPercentage = element.discountPercentage
        purchaseEntryEntity.material = materialEntity
        purchaseEntryEntity.purchase = purchaseEntity

        await AppDataSource.getRepository(PurchaseEntry).save(purchaseEntryEntity)
        
    }

    return res
}

async function updatePurchase(purchaseData: IPurchaseData){
    console.log("Updating purchase data..")
    var clientEntity = new Client()
    const ignoreClientPropList = ['editCreate', 'deleteFlag', 'createdDate']
    for (let index = 0; index < Object.keys(purchaseData.supplier).length; index++) {
        if (!(ignoreClientPropList.includes(Object.keys(purchaseData.supplier)[index]))) {
            clientEntity[Object.keys(purchaseData.supplier)[index]] = purchaseData.supplier[Object.keys(purchaseData.supplier)[index]];
        }
        
    }

    const purchaseEntity = new Purchase()
    purchaseEntity.purchaseID = purchaseData.purchaseID
    purchaseEntity.supplier = clientEntity
    purchaseEntity.purchaseDate = purchaseData.purchaseDate
    purchaseEntity.remarks = purchaseData.remarks

    purchaseEntity.gstPercentage = purchaseData.gstPercentage
    purchaseEntity.overallDiscountPercentage = purchaseData.overallDiscountPercentage
    purchaseEntity.transportCharges = purchaseData.transportCharges
    purchaseEntity.miscCharges = purchaseData.miscCharges
    purchaseEntity.paymentTerms = purchaseData.paymentTerms

    purchaseEntity.dispatchDate = purchaseData?.dispatchDate
    purchaseEntity.deliveredDate = purchaseData?.deliveredDate
    purchaseEntity.returnedDate = purchaseData?.returnedDate
    purchaseEntity.refundedDate = purchaseData?.refundedDate
    purchaseEntity.completedDate = purchaseData?.completedDate
    purchaseEntity.cancelledDate = purchaseData?.cancelledDate
    
    const res = await AppDataSource.manager.update(Purchase,
        {
            purchaseID: purchaseData.purchaseID
        },
        {
            ...purchaseEntity
    })

    for (let index = 0; index < purchaseData.purchaseEntries.length; index++) {
        const element = purchaseData.purchaseEntries[index];

        const materialEntity = new Material()
        materialEntity.description = element.material.description
        materialEntity.materialID = element.material.materialID
        materialEntity.materialName = element.material.materialName
        materialEntity.remarks = element.material.remarks

        const purchaseEntryEntity = new PurchaseEntry()
        purchaseEntryEntity.price = element.price
        purchaseEntryEntity.quantity = element.quantity
        purchaseEntryEntity.discountPercentage = element.discountPercentage
        purchaseEntryEntity.material = materialEntity
        purchaseEntryEntity.purchase = purchaseEntity

        if (element.returnFlag !== undefined) {
            purchaseEntryEntity.returnFlag = element.returnFlag
        }

        if (element.purchaseEntryID === undefined) {
            purchaseEntryEntity.purchaseEntryID = element.purchaseEntryID
            await AppDataSource.getRepository(PurchaseEntry).save(purchaseEntryEntity)
        } else {
            await AppDataSource.getRepository(PurchaseEntry).update({
                purchaseEntryID: element.purchaseEntryID
            },{
                ...purchaseEntryEntity
            })
        }       

    }
    
    return res
}


async function insertPurchaseEntry(purchaseEntryList: IPurchaseEntry[]) {
    console.log("INFO : Inserting purchase entry data")
    return await AppDataSource
                        .createQueryBuilder()
                        .insert()
                        .into(PurchaseEntry)
                        .values(purchaseEntryList)
                        .execute()
}


async function deletePurchaseEntry(purchaseEntry) {
    console.log("INFO : Deleting purchase entry data")
    return await AppDataSource
                    .getRepository(PurchaseEntry)
                    .delete(purchaseEntry)
    
}


async function insertPurchaseTransaction(transaction: IPurchaseTransactions){
    console.log("INFO : Inserting purchase transaction data")

    const purchaseEntity = new Purchase()
    purchaseEntity.purchaseID = transaction.purchase.purchaseID
    purchaseEntity.remarks = transaction.purchase.remarks

    const purchaseTransactionEntity = new PurchaseTransaction()
    purchaseTransactionEntity.purchase = purchaseEntity
    purchaseTransactionEntity.transactionType = transaction.transactionType
    purchaseTransactionEntity.transactionAmount = transaction.transactionAmount
    purchaseTransactionEntity.transactionDate = transaction.transactionDate
    purchaseTransactionEntity.remarks = transaction.remarks

    const res = await AppDataSource.manager.save(purchaseTransactionEntity)
    return res
}

async function updatePurchaseTransaction(transaction: IPurchaseTransactions){
    console.log("INFO : Updating purchase transaction data")

    const res = await AppDataSource.manager.update(PurchaseTransaction,{
        transactionID: transaction.transactionID
    },{
        transactionType: transaction.transactionType,
        transactionAmount: transaction.transactionAmount,
        transactionDate: transaction.transactionDate,
        remarks: transaction.remarks
    })
    return res
}


async function deletePurchaseTransaction(transactionID: string){
    console.log("INFO : Deleting purchase transaction data..")
    const res = await AppDataSource.manager.delete(PurchaseTransaction, {
        transactionID: transactionID
    })
    return res
}

export {
    getAllPurchase, 
    getPurchaseByID,
    insertPurchase, 
    updatePurchase, 
    softDeletePurchase, 
    deletePurchase,
    insertPurchaseEntry,
    deletePurchaseEntry,
    insertPurchaseTransaction,
    updatePurchaseTransaction,
    deletePurchaseTransaction
}