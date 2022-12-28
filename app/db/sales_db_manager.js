"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSaleTransaction = exports.insertSaleTransaction = exports.deleteSaleTransaction = exports.getSaleTransactionByID = exports.getAllSaleTransactions = exports.deleteSaleEntry = exports.insertSaleEntry = exports.getSaleEntryBySaleID = exports.updateSale = exports.insertSale = exports.deleteSale = exports.softDeleteSale = exports.getSaleByID = exports.getAllSales = void 0;
const db_manager_1 = require("./db_manager");
const items_schema_1 = require("./data/models/items.schema");
function getAllSales() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting sales data');
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.Sales).find({
            relations: {
                salesID: true
            }
        });
        return res;
    });
}
exports.getAllSales = getAllSales;
function getSaleByID(salesID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO : Getting sales data by ID");
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.Sales).find({
            relations: {
                salesID: true
            },
            where: {
                salesID: salesID
            }
        });
        return res;
    });
}
exports.getSaleByID = getSaleByID;
function softDeleteSale(salesID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Soft deleting sale by ID");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Sales, {
            salesID: salesID
        }, {
            deleteFlag: true
        });
        return res;
    });
}
exports.softDeleteSale = softDeleteSale;
function deleteSale(salesID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Hard deleting sale by ID");
        const res = yield db_manager_1.AppDataSource.manager.delete(items_schema_1.Sales, {
            salesID: salesID
        });
        return res;
    });
}
exports.deleteSale = deleteSale;
function insertSale(saleCompleteData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Inserting sale and transaction data..");
        const saleEntity = new items_schema_1.Sales();
        saleEntity.customerID = saleCompleteData.saleData.purchaser;
        saleEntity.saleType = saleCompleteData.saleData.saleType;
        saleEntity.remarks = saleCompleteData.saleData.remarks;
        const res = yield db_manager_1.AppDataSource.manager.save(saleEntity);
        return res;
    });
}
exports.insertSale = insertSale;
function updateSale(sale) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Updating sale data..");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Sales, {
            salesID: sale.salesID
        }, {
            customerID: sale.purchaser,
            remarks: sale.remarks,
        });
        return res;
    });
}
exports.updateSale = updateSale;
function getSaleEntryBySaleID(salesID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO : Getting sale entry data by ID");
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.SaleEntry).find({
            where: {
                salesID: salesID
            }
        });
        return res;
    });
}
exports.getSaleEntryBySaleID = getSaleEntryBySaleID;
function insertSaleEntry(salesEntryList) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO : Inserting sale entry data");
        return yield db_manager_1.AppDataSource
            .createQueryBuilder()
            .insert()
            .into(items_schema_1.SaleEntry)
            .values(salesEntryList)
            .execute();
    });
}
exports.insertSaleEntry = insertSaleEntry;
function deleteSaleEntry(saleEntry) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO : Deleting sale entry data");
        return yield db_manager_1.AppDataSource
            .getRepository(items_schema_1.SaleEntry)
            .createQueryBuilder("saleEntry")
            .delete()
            .where(`saleEntry.salesID = ${saleEntry.salesID}`)
            .andWhere(`saleEntry.productID = ${saleEntry.productID}`)
            .execute();
    });
}
exports.deleteSaleEntry = deleteSaleEntry;
function getAllSaleTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting sale transaction data');
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.SaleTransaction).find({
            relations: {
                salesID: true
            }
        });
        return res;
    });
}
exports.getAllSaleTransactions = getAllSaleTransactions;
function getSaleTransactionByID(transactionID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting sale transaction data by ID');
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.SaleTransaction).find({
            where: {
                transactionID: transactionID
            }
        });
        return res;
    });
}
exports.getSaleTransactionByID = getSaleTransactionByID;
function insertSaleTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO : Inserting sale transaction data");
        const saleTransactionEntity = new items_schema_1.SaleTransaction();
        saleTransactionEntity.salesID = transaction.salesID;
        saleTransactionEntity.transactionType = transaction.transactionType;
        saleTransactionEntity.amount = transaction.amount;
        saleTransactionEntity.transactionDate = transaction.transactionDate;
        saleTransactionEntity.remarks = transaction.remarks;
        const res = yield db_manager_1.AppDataSource.manager.save(saleTransactionEntity);
        return res;
    });
}
exports.insertSaleTransaction = insertSaleTransaction;
function updateSaleTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO : Updating sale transaction data");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.SaleTransaction, {
            transactionID: transaction.transactionID
        }, {
            amount: transaction.amount,
            transactionDate: transaction.transactionDate,
            remarks: transaction.remarks,
        });
        return res;
    });
}
exports.updateSaleTransaction = updateSaleTransaction;
function deleteSaleTransaction(transactionID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO : Deleting sale transaction data..");
        const res = yield db_manager_1.AppDataSource.manager.delete(items_schema_1.SaleTransaction, {
            transactionID: transactionID
        });
        return res;
    });
}
exports.deleteSaleTransaction = deleteSaleTransaction;
//# sourceMappingURL=sales_db_manager.js.map