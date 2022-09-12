import { AppDataSource } from "./db_manager";
import { Sales, SaleTransactions } from "./data/models/items.schema";
import { ISalesData, ISaleTransactionComplete, ISaleTransactions } from "../../src/app/sales/interfaces/salesdata.interface";


async function getAllSales(){
    console.log('Getting sales data..')

    const res = await AppDataSource.getRepository(Sales).find(
        {
            relations: {
                saleTransactions: true
            }
        }
    )

    return res
}

async function getSaleByID(salesID: string){
    console.log("Getting sales data by ID..")
    const res = await AppDataSource.getRepository(Sales).find(
        {
            relations: {
                saleTransactions: true
            },
            where: {
                salesID: salesID
            }
        }
    )

    return res
}

async function deleteSale(salesID: string){
    console.log("Deleting sale data..")
    const res = await AppDataSource.manager.delete(Sales, {
        salesID: salesID
    })
    return res
}

async function insertSale(saleCompleteData: ISaleTransactionComplete){
    console.log("Inserting sale and transaction data..")

    const saleEntity = new Sales()
    saleEntity.productID = saleCompleteData.saleData.productID
    saleEntity.purchaser = saleCompleteData.saleData.purchaser
    saleEntity.supplier = saleCompleteData.saleData.supplier
    saleEntity.saleDate = saleCompleteData.saleData.saleDate
    saleEntity.saleType = saleCompleteData.saleData.saleType
    saleEntity.sellingPrice = saleCompleteData.saleData.sellingPrice
    saleEntity.sellingQuantity = saleCompleteData.saleData.sellingQuantity
    saleEntity.remarks = saleCompleteData.saleData.remarks

    const saleTransactionEntity = new SaleTransactions()
    saleTransactionEntity.paid = saleCompleteData.transactionData.paid
    saleTransactionEntity.remarks = saleCompleteData.transactionData.remarks
    saleTransactionEntity.transactionDate = saleCompleteData.transactionData.transactionDate
    saleTransactionEntity.sale = saleEntity

    const res = await AppDataSource.manager.save(saleEntity)
    await AppDataSource.manager.save(saleTransactionEntity)

    return res
}

async function updateSale(sale: ISalesData){
    console.log("Updating sale data..")
    const res = await AppDataSource.manager.update(Sales,
        {
            salesID: sale.salesID
        },
        {
        productID: sale.productID,
        purchaser: sale.purchaser,
        supplier: sale.supplier,
        saleType: sale.saleType,
        sellingPrice: sale.sellingPrice,
        sellingQuantity: sale.sellingQuantity,
        remarks: sale.remarks,
        saleDate: sale.saleDate,
    })
    return res
}

async function getAllSaleTransactions(){
    console.log('Getting sale transation data..')
    const res = await AppDataSource.getRepository(SaleTransactions).find(
        {
            relations: {
                sale: true
            }
        }
    )

    return res
}

async function getSaleTransactionByID(transactionID: string){
    console.log('getting sale transation data..')
    const res = await AppDataSource.getRepository(SaleTransactions).find(
        {
            relations: {
                sale: true
            },
            where: {
                transactionID: transactionID
            }
        }
    )

    return res
}

async function deleteSaleTransaction(transactionID: string){
    console.log("Deleting sale transaction data..")
    const res = await AppDataSource.manager.delete(SaleTransactions, {
        transactionID: transactionID
    })
    return res
}

async function insertSaleTransaction(transaction: ISaleTransactions){
    console.log("Inserting sale transaction data..")

    const saleEntity = await AppDataSource.getRepository(Sales).find({
        where: {salesID: transaction.salesID},
    })

    const saleTransactionEntity = new SaleTransactions()
    saleTransactionEntity.paid = transaction.paid
    saleTransactionEntity.remarks = transaction.remarks
    saleTransactionEntity.transactionDate = transaction.transactionDate
    saleTransactionEntity.sale = saleEntity[0]

    const res = await AppDataSource.manager.save(saleTransactionEntity)
    return res
}

async function updateSaleTransaction(transaction: ISaleTransactions){
    console.log("Updating sale transaction data..")
    const res = await AppDataSource.manager.update(SaleTransactions,
        {
            transactionID: transaction.transactionID
        },
        {
            paid: transaction.paid,
            transactionDate: transaction.transactionDate,
            remarks: transaction.remarks,
    })
    return res
}

export {
    getAllSales, 
    getSaleByID, 
    deleteSale, 
    insertSale, 
    updateSale, 
    getAllSaleTransactions, 
    getSaleTransactionByID,
    deleteSaleTransaction,
    insertSaleTransaction,
    updateSaleTransaction
}