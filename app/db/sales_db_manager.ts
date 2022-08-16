import { AppDataSource } from "./db_manager";
import { Sales, SaleTransactions } from "./data/models/items.schema";
import { ISalesData, ISaleTransactions } from "../../src/app/sales/interfaces/salesdata.interface";

async function getAllSales(){
    console.log('getting sales data..')
    const res = await AppDataSource.manager
    .createQueryBuilder(Sales, "sales")
    .getMany()
    return res
}

async function getSaleByID(salesID: string){
    console.log('getting sales data..')
    const res = await AppDataSource.manager
    .createQueryBuilder(Sales, "sales")
    .where("salesID = :id", { id: salesID })
    .getMany()
    return res
}

async function deleteSale(salesID: string){
    console.log("Deleting sale data..")
    const res = await AppDataSource.manager.delete(Sales, {
        salesID: salesID
    })
    return res
}

async function insertSale(sale: ISalesData){
    console.log("Inserting sale data..")
    const res = await AppDataSource.manager.insert(Sales, {
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
    console.log('getting sale transation data..')
    const res = await AppDataSource.manager
    .createQueryBuilder(SaleTransactions, "saleTransactions")
    .getMany()
    return res
}

async function getSaleTransactionByID(transactionID: string){
    console.log('getting sale transation data..')
    const res = await AppDataSource.manager
    .createQueryBuilder(SaleTransactions, "saleTransactions")
    .where("transactionID = :id", { id: transactionID })
    .getMany()
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
    const res = await AppDataSource.manager.insert(SaleTransactions, {
        transactionID: transaction.transactionID,
        salesID: transaction.salesID,
        paid: transaction.paid,
        transactionDate: transaction.transactionDate,
        remarks: transaction.remarks,
    })
    return res
}

async function updateSaleTransaction(transaction: ISaleTransactions){
    console.log("Updating sale transaction data..")
    const res = await AppDataSource.manager.update(SaleTransactions,
        {
            transactionID: transaction.transactionID
        },
        {
            salesID: transaction.salesID,
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