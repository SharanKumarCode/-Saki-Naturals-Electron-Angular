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
exports.updateSaleTransaction = exports.insertSaleTransaction = exports.deleteSaleTransaction = exports.getSaleTransactionByID = exports.getAllSaleTransactions = exports.updateSale = exports.insertSale = exports.deleteSale = exports.getSaleByID = exports.getAllSales = void 0;
const db_manager_1 = require("./db_manager");
const items_schema_1 = require("./data/models/items.schema");
function getAllSales() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getting sales data..');
        const res = yield db_manager_1.AppDataSource.manager
            .createQueryBuilder(items_schema_1.Sales, "sales")
            .getMany();
        return res;
    });
}
exports.getAllSales = getAllSales;
function getSaleByID(salesID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getting sales data..');
        const res = yield db_manager_1.AppDataSource.manager
            .createQueryBuilder(items_schema_1.Sales, "sales")
            .where("salesID = :id", { id: salesID })
            .getMany();
        return res;
    });
}
exports.getSaleByID = getSaleByID;
function deleteSale(salesID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Deleting sale data..");
        const res = yield db_manager_1.AppDataSource.manager.delete(items_schema_1.Sales, {
            salesID: salesID
        });
        return res;
    });
}
exports.deleteSale = deleteSale;
function insertSale(sale) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Inserting sale data..");
        const res = yield db_manager_1.AppDataSource.manager.insert(items_schema_1.Sales, {
            productID: sale.productID,
            purchaser: sale.purchaser,
            supplier: sale.supplier,
            saleType: sale.saleType,
            sellingPrice: sale.sellingPrice,
            sellingQuantity: sale.sellingQuantity,
            remarks: sale.remarks,
            saleDate: sale.saleDate,
        });
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
            productID: sale.productID,
            purchaser: sale.purchaser,
            supplier: sale.supplier,
            saleType: sale.saleType,
            sellingPrice: sale.sellingPrice,
            sellingQuantity: sale.sellingQuantity,
            remarks: sale.remarks,
            saleDate: sale.saleDate,
        });
        return res;
    });
}
exports.updateSale = updateSale;
function getAllSaleTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getting sale transation data..');
        const res = yield db_manager_1.AppDataSource.manager
            .createQueryBuilder(items_schema_1.SaleTransactions, "saleTransactions")
            .getMany();
        return res;
    });
}
exports.getAllSaleTransactions = getAllSaleTransactions;
function getSaleTransactionByID(transactionID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getting sale transation data..');
        const res = yield db_manager_1.AppDataSource.manager
            .createQueryBuilder(items_schema_1.SaleTransactions, "saleTransactions")
            .where("transactionID = :id", { id: transactionID })
            .getMany();
        return res;
    });
}
exports.getSaleTransactionByID = getSaleTransactionByID;
function deleteSaleTransaction(transactionID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Deleting sale transaction data..");
        const res = yield db_manager_1.AppDataSource.manager.delete(items_schema_1.SaleTransactions, {
            transactionID: transactionID
        });
        return res;
    });
}
exports.deleteSaleTransaction = deleteSaleTransaction;
function insertSaleTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Inserting sale transaction data..");
        const res = yield db_manager_1.AppDataSource.manager.insert(items_schema_1.SaleTransactions, {
            transactionID: transaction.transactionID,
            salesID: transaction.salesID,
            paid: transaction.paid,
            transactionDate: transaction.transactionDate,
            remarks: transaction.remarks,
        });
        return res;
    });
}
exports.insertSaleTransaction = insertSaleTransaction;
function updateSaleTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Updating sale transaction data..");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.SaleTransactions, {
            transactionID: transaction.transactionID
        }, {
            salesID: transaction.salesID,
            paid: transaction.paid,
            transactionDate: transaction.transactionDate,
            remarks: transaction.remarks,
        });
        return res;
    });
}
exports.updateSaleTransaction = updateSaleTransaction;
//# sourceMappingURL=sales_db_manager.js.map