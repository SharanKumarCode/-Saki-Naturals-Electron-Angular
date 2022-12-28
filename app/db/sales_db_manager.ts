import { AppDataSource } from "./db_manager";
import { Client, SaleEntry, Sales, SaleTransaction } from "./data/models/items.schema";
import { ISaleEntry, ISalesData, ISaleTransactionComplete, ISaleTransactions } from "../../src/app/core/interfaces/interfaces";


async function getAllSales(){
    console.log('INFO : Getting sales data')

    const res = await AppDataSource.getRepository(Sales).find(
        {
            relations: {
                salesID: true
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
                salesID: true
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

async function deleteSale(salesID: string){
    console.log("INFO: Hard deleting sale by ID")
    const res = await AppDataSource.manager.delete(Sales, {
        salesID: salesID
    })
    return res
}

async function insertSale(saleCompleteData: ISaleTransactionComplete){
    console.log("INFO: Inserting sale and transaction data..")

    const clientEntity = new Client()

    const saleEntity = new Sales()
    saleEntity.customer = clientEntity
    saleEntity.saleType = saleCompleteData.saleData.saleType
    saleEntity.remarks = saleCompleteData.saleData.remarks
    
    const res = await AppDataSource.manager.save(saleEntity)

    return res
}

async function updateSale(sale: ISalesData){
    console.log("Updating sale data..")
    const clientEntity = new Client()
    const res = await AppDataSource.manager.update(Sales,
        {
            salesID: sale.salesID
        },
        {
        customer: clientEntity,
        remarks: sale.remarks
    })
    return res
}

async function getSaleEntryBySaleID(salesID:string) {
    console.log("INFO : Getting sale entry data by ID")
    const res = await AppDataSource.getRepository(SaleEntry).find(
        {
            where: {
                salesID: salesID
            }
        }
    )

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


async function deleteSaleEntry(saleEntry:ISaleEntry) {
    console.log("INFO : Deleting sale entry data")
    return await AppDataSource
                    .getRepository(SaleEntry)
                    .createQueryBuilder("saleEntry")
                    .delete()
                    .where(`saleEntry.salesID = ${saleEntry.salesID}`)
                    .andWhere(`saleEntry.productID = ${saleEntry.productID}`)
                    .execute()
    
}

async function getAllSaleTransactions(){
    console.log('INFO : Getting sale transaction data')
    const res = await AppDataSource.getRepository(SaleTransaction).find(
        {
            relations: {
                salesID: true
            }
        }
    )

    return res
}

async function getSaleTransactionByID(transactionID: string){
    console.log('INFO : Getting sale transaction data by ID')
    const res = await AppDataSource.getRepository(SaleTransaction).find(
        {
            where: {
                transactionID: transactionID
            }
        }
    )

    return res
}

async function insertSaleTransaction(transaction: ISaleTransactions){
    console.log("INFO : Inserting sale transaction data")

    const saleTransactionEntity = new SaleTransaction()
    saleTransactionEntity.salesID = transaction.salesID
    saleTransactionEntity.transactionType = transaction.transactionType
    saleTransactionEntity.amount = transaction.amount
    saleTransactionEntity.transactionDate = transaction.transactionDate
    saleTransactionEntity.remarks = transaction.remarks

    const res = await AppDataSource.manager.save(saleTransactionEntity)
    return res
}

async function updateSaleTransaction(transaction: ISaleTransactions){
    console.log("INFO : Updating sale transaction data")
    const res = await AppDataSource.manager.update(SaleTransaction,
        {
            transactionID: transaction.transactionID
        },
        {
            amount: transaction.amount,
            transactionDate: transaction.transactionDate,
            remarks: transaction.remarks,
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
    softDeleteSale, 
    deleteSale, 
    insertSale, 
    updateSale, 
    getSaleEntryBySaleID,
    insertSaleEntry,
    deleteSaleEntry,
    getAllSaleTransactions, 
    getSaleTransactionByID,
    deleteSaleTransaction,
    insertSaleTransaction,
    updateSaleTransaction
}