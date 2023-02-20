import { AppDataSource } from "./db_manager";
import { ISaleEntry, ISalesData, ISaleTransactions } from "../../src/app/core/interfaces/interfaces";
import { Sales, Client, ProductGroup, Product, SaleEntry, SaleTransaction } from "./data/models/items.schema";

async function getAllSales(){
    console.log('INFO : Getting sales data')

    const res = await AppDataSource.getRepository(Sales).find(
        {
            relations: {
                customer: true,
                saleEntries: {
                    product: {
                        productGroup: true
                    }
                },
                saleTransactions: true
        }
        }
    )

    return res
}

async function getSaleByID(salesID: string){
    console.log("INFO : Getting sales data by ID")
    const res = await AppDataSource.getRepository(Sales).find(
        {
            relations: {
                customer: true,
                saleEntries: {
                    product: {
                        productGroup: true
                    }
                },
                saleTransactions: true
        },
            where: {
                salesID: salesID
            }
        }
    )

    return res
}

async function softDeleteSale(salesID: string){
    console.log("INFO: Soft deleting sale by ID")
    const res = await AppDataSource.manager.update(Sales, {
        salesID: salesID
    }, {
        deleteFlag: true
    })
    return res
}

async function unDeleteSale(salesID: string){
    console.log("INFO: reverting deleted sale by ID")
    const res = await AppDataSource.manager.update(Sales, {
        salesID: salesID
    }, {
        deleteFlag: false
    })
    return res
}


async function deleteSale(salesID: string){
    console.log("INFO: Hard deleting sale by ID")
    const res = await AppDataSource.manager.delete(Sales, {
        salesID: salesID
    })
    return res
}

async function insertSale(saleData: ISalesData){
    console.log("INFO: Inserting sale and transaction data..")

    var clientEntity = new Client()
    const ignoreClientPropList = ['editCreate', 'deleteFlag', 'createdDate']
    for (let index = 0; index < Object.keys(saleData.customer).length; index++) {
        if (!(ignoreClientPropList.includes(Object.keys(saleData.customer)[index]))) {
            clientEntity[Object.keys(saleData.customer)[index]] = saleData.customer[Object.keys(saleData.customer)[index]];
        }
        
    }
    
    const saleEntity = new Sales()
    saleEntity.customer = clientEntity
    saleEntity.saleType = saleData.saleType
    saleEntity.salesDate = saleData.salesDate
    saleEntity.remarks = saleData.remarks

    saleEntity.gstPercentage = saleData.gstPercentage
    saleEntity.overallDiscountPercentage = saleData.overallDiscountPercentage
    saleEntity.transportCharges = saleData.transportCharges
    saleEntity.miscCharges = saleData.miscCharges
    saleEntity.paymentTerms = saleData.paymentTerms

    saleEntity.dispatchDate = saleData.dispatchDate
    saleEntity.deliveredDate = saleData.deliveredDate
    saleEntity.completedDate = saleData.completedDate
    
    const res = await AppDataSource.getRepository(Sales).save(saleEntity)

    for (let index = 0; index < saleData.saleEntries.length; index++) {
        const element = saleData.saleEntries[index];
        const productGroupEntity = new ProductGroup()
        productGroupEntity.productGroupID = element.product.productGroupID
        productGroupEntity.productGroupName = element.product.productGroupName

        const productEntity = new Product()
        productEntity.productGroup = productGroupEntity
        productEntity.description = element.product.description
        productEntity.productID = element.product.productID
        productEntity.productName = element.product.productName
        productEntity.priceDealer = element.product.priceDealer
        productEntity.priceDirectSale = element.product.priceDirectSale
        productEntity.priceReseller = element.product.priceReseller
        productEntity.remarks = element.product.remarks

        const saleEntryEntity = new SaleEntry()
        saleEntryEntity.price = element.price
        saleEntryEntity.quantity = element.quantity
        saleEntryEntity.discountPercentage = element.discountPercentage
        saleEntryEntity.product = productEntity
        saleEntryEntity.sale = saleEntity

        await AppDataSource.getRepository(SaleEntry).save(saleEntryEntity)
        
    }

    return res
}

async function updateSale(saleData: ISalesData){
    console.log("Updating sale data..")
    console.log(saleData);
    var clientEntity = new Client()
    const ignoreClientPropList = ['editCreate', 'deleteFlag', 'createdDate']
    for (let index = 0; index < Object.keys(saleData.customer).length; index++) {
        if (!(ignoreClientPropList.includes(Object.keys(saleData.customer)[index]))) {
            clientEntity[Object.keys(saleData.customer)[index]] = saleData.customer[Object.keys(saleData.customer)[index]];
        }
        
    }

    const saleEntity = new Sales()
    saleEntity.salesID = saleData.salesID
    saleEntity.customer = clientEntity
    saleEntity.saleType = saleData.saleType
    saleEntity.salesDate = saleData.salesDate
    saleEntity.remarks = saleData.remarks

    saleEntity.gstPercentage = saleData.gstPercentage
    saleEntity.overallDiscountPercentage = saleData.overallDiscountPercentage
    saleEntity.transportCharges = saleData.transportCharges
    saleEntity.miscCharges = saleData.miscCharges
    saleEntity.paymentTerms = saleData.paymentTerms

    saleEntity.dispatchDate = saleData?.dispatchDate
    saleEntity.deliveredDate = saleData?.deliveredDate
    saleEntity.returnedDate = saleData?.returnedDate
    saleEntity.refundedDate = saleData?.refundedDate
    saleEntity.completedDate = saleData?.completedDate
    saleEntity.cancelledDate = saleData?.cancelledDate
    
    const res = await AppDataSource.manager.update(Sales,
        {
            salesID: saleData.salesID
        },
        {
            ...saleEntity
    })

    for (let index = 0; index < saleData.saleEntries.length; index++) {
        const element = saleData.saleEntries[index];
        const productGroupEntity = new ProductGroup()
        productGroupEntity.productGroupID = element.product.productGroupID
        productGroupEntity.productGroupName = element.product.productGroupName

        const productEntity = new Product()
        productEntity.productGroup = productGroupEntity
        productEntity.description = element.product.description
        productEntity.productID = element.product.productID
        productEntity.productName = element.product.productName
        productEntity.priceDealer = element.product.priceDealer
        productEntity.priceDirectSale = element.product.priceDirectSale
        productEntity.priceReseller = element.product.priceReseller
        productEntity.remarks = element.product.remarks

        const saleEntryEntity = new SaleEntry()
        saleEntryEntity.price = element.price
        saleEntryEntity.quantity = element.quantity
        saleEntryEntity.discountPercentage = element.discountPercentage
        saleEntryEntity.product = productEntity
        saleEntryEntity.sale = saleEntity

        if (element.returnFlag !== undefined) {
            saleEntryEntity.returnFlag = element.returnFlag
        }

        if (element.saleEntryID === undefined) {
            saleEntryEntity.saleEntryID = element.saleEntryID
            await AppDataSource.getRepository(SaleEntry).save(saleEntryEntity)
        } else {
            await AppDataSource.getRepository(SaleEntry).update({
                saleEntryID: element.saleEntryID
            },{
                ...saleEntryEntity
            })
        }       

    }
    
    return res
}


async function insertSaleEntry(salesEntryList: ISaleEntry[]) {
    console.log("INFO : Inserting sale entry data")
    return await AppDataSource
                        .createQueryBuilder()
                        .insert()
                        .into(SaleEntry)
                        .values(salesEntryList)
                        .execute()
}


async function deleteSaleEntry(saleEntry) {
    console.log("INFO : Deleting sale entry data")
    return await AppDataSource
                    .getRepository(SaleEntry)
                    .delete(saleEntry)
    
}


async function insertSaleTransaction(transaction: ISaleTransactions){
    console.log("INFO : Inserting sale transaction data")

    const saleEntity = new Sales()
    saleEntity.salesID = transaction.sales.salesID
    saleEntity.saleType = transaction.sales.saleType
    saleEntity.remarks = transaction.sales.remarks

    const saleTransactionEntity = new SaleTransaction()
    saleTransactionEntity.sale = saleEntity
    saleTransactionEntity.transactionType = transaction.transactionType
    saleTransactionEntity.transactionAmount = transaction.transactionAmount
    saleTransactionEntity.transactionDate = transaction.transactionDate
    saleTransactionEntity.remarks = transaction.remarks

    const res = await AppDataSource.manager.save(saleTransactionEntity)
    return res
}

async function updateSaleTransaction(transaction: ISaleTransactions){
    console.log("INFO : Updating sale transaction data")

    const res = await AppDataSource.manager.update(SaleTransaction,{
        transactionID: transaction.transactionID
    },{
        transactionType: transaction.transactionType,
        transactionAmount: transaction.transactionAmount,
        transactionDate: transaction.transactionDate,
        remarks: transaction.remarks
    })
    return res
}


async function deleteSaleTransaction(transactionID: string){
    console.log("INFO : Deleting sale transaction data..")
    const res = await AppDataSource.manager.delete(SaleTransaction, {
        transactionID: transactionID
    })
    return res
}

export {
    getAllSales, 
    getSaleByID,
    insertSale, 
    updateSale, 
    softDeleteSale, 
    deleteSale,
    insertSaleEntry,
    deleteSaleEntry,
    insertSaleTransaction,
    updateSaleTransaction,
    deleteSaleTransaction
}