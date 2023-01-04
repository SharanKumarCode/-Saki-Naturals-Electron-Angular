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
exports.deleteSaleTransaction = exports.updateSaleTransaction = exports.insertSaleTransaction = exports.deleteSaleEntry = exports.insertSaleEntry = exports.updateSale = exports.insertSale = exports.deleteSale = exports.softDeleteSale = exports.getSaleByID = exports.getAllSales = void 0;
const db_manager_1 = require("./db_manager");
const items_schema_1 = require("./data/models/items.schema");
function getAllSales() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting sales data');
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.Sales).find({
            relations: {
                customer: true,
                saleEntries: {
                    product: {
                        productGroup: true
                    }
                },
                saleTransactions: true
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
function unDeleteSale(salesID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: reverting deleted sale by ID");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Sales, {
            salesID: salesID
        }, {
            deleteFlag: false
        });
        return res;
    });
}
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
function insertSale(saleData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Inserting sale and transaction data..");
        var clientEntity = new items_schema_1.Client();
        const ignoreClientPropList = ['editCreate', 'deleteFlag', 'createdDate'];
        for (let index = 0; index < Object.keys(saleData.customer).length; index++) {
            if (!(ignoreClientPropList.includes(Object.keys(saleData.customer)[index]))) {
                clientEntity[Object.keys(saleData.customer)[index]] = saleData.customer[Object.keys(saleData.customer)[index]];
            }
        }
        const saleEntity = new items_schema_1.Sales();
        saleEntity.customer = clientEntity;
        saleEntity.saleType = saleData.saleType;
        saleEntity.salesDate = saleData.salesDate;
        saleEntity.remarks = saleData.remarks;
        saleEntity.gstPercentage = saleData.gstPercentage;
        saleEntity.overallDiscountPercentage = saleData.overallDiscountPercentage;
        saleEntity.transportCharges = saleData.transportCharges;
        saleEntity.miscCharges = saleData.miscCharges;
        saleEntity.paymentTerms = saleData.paymentTerms;
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.Sales).save(saleEntity);
        for (let index = 0; index < saleData.saleEntries.length; index++) {
            const element = saleData.saleEntries[index];
            const productGroupEntity = new items_schema_1.ProductGroup();
            productGroupEntity.productGroupID = element.product.productGroupID;
            productGroupEntity.productGroupName = element.product.productGroupName;
            const productEntity = new items_schema_1.Product();
            productEntity.productGroup = productGroupEntity;
            productEntity.description = element.product.description;
            productEntity.productID = element.product.productID;
            productEntity.productName = element.product.productName;
            productEntity.priceDealer = element.product.priceDealer;
            productEntity.priceDirectSale = element.product.priceDirectSale;
            productEntity.priceReseller = element.product.priceReseller;
            productEntity.remarks = element.product.remarks;
            const saleEntryEntity = new items_schema_1.SaleEntry();
            saleEntryEntity.price = element.price;
            saleEntryEntity.quantity = element.quantity;
            saleEntryEntity.discountPercentage = element.discountPercentage;
            saleEntryEntity.product = productEntity;
            saleEntryEntity.sale = saleEntity;
            yield db_manager_1.AppDataSource.getRepository(items_schema_1.SaleEntry).save(saleEntryEntity);
        }
        return res;
    });
}
exports.insertSale = insertSale;
function updateSale(saleData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Updating sale data..");
        console.log(saleData);
        var clientEntity = new items_schema_1.Client();
        const ignoreClientPropList = ['editCreate', 'deleteFlag', 'createdDate'];
        for (let index = 0; index < Object.keys(saleData.customer).length; index++) {
            if (!(ignoreClientPropList.includes(Object.keys(saleData.customer)[index]))) {
                clientEntity[Object.keys(saleData.customer)[index]] = saleData.customer[Object.keys(saleData.customer)[index]];
            }
        }
        const saleEntity = new items_schema_1.Sales();
        saleEntity.salesID = saleData.salesID;
        saleEntity.customer = clientEntity;
        saleEntity.saleType = saleData.saleType;
        saleEntity.salesDate = saleData.salesDate;
        saleEntity.remarks = saleData.remarks;
        saleEntity.gstPercentage = saleData.gstPercentage;
        saleEntity.overallDiscountPercentage = saleData.overallDiscountPercentage;
        saleEntity.transportCharges = saleData.transportCharges;
        saleEntity.miscCharges = saleData.miscCharges;
        saleEntity.paymentTerms = saleData.paymentTerms;
        saleEntity.dispatchDate = saleData === null || saleData === void 0 ? void 0 : saleData.dispatchDate;
        saleEntity.deliveredDate = saleData === null || saleData === void 0 ? void 0 : saleData.deliveredDate;
        saleEntity.returnedDate = saleData === null || saleData === void 0 ? void 0 : saleData.returnedDate;
        saleEntity.refundedDate = saleData === null || saleData === void 0 ? void 0 : saleData.refundedDate;
        saleEntity.completedDate = saleData === null || saleData === void 0 ? void 0 : saleData.completedDate;
        saleEntity.cancelledDate = saleData === null || saleData === void 0 ? void 0 : saleData.cancelledDate;
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Sales, {
            salesID: saleData.salesID
        }, Object.assign({}, saleEntity));
        for (let index = 0; index < saleData.saleEntries.length; index++) {
            const element = saleData.saleEntries[index];
            const productGroupEntity = new items_schema_1.ProductGroup();
            productGroupEntity.productGroupID = element.product.productGroupID;
            productGroupEntity.productGroupName = element.product.productGroupName;
            const productEntity = new items_schema_1.Product();
            productEntity.productGroup = productGroupEntity;
            productEntity.description = element.product.description;
            productEntity.productID = element.product.productID;
            productEntity.productName = element.product.productName;
            productEntity.priceDealer = element.product.priceDealer;
            productEntity.priceDirectSale = element.product.priceDirectSale;
            productEntity.priceReseller = element.product.priceReseller;
            productEntity.remarks = element.product.remarks;
            const saleEntryEntity = new items_schema_1.SaleEntry();
            saleEntryEntity.price = element.price;
            saleEntryEntity.quantity = element.quantity;
            saleEntryEntity.discountPercentage = element.discountPercentage;
            saleEntryEntity.product = productEntity;
            saleEntryEntity.sale = saleEntity;
            if (element.returnFlag !== undefined) {
                saleEntryEntity.returnFlag = element.returnFlag;
            }
            if (element.saleEntryID === undefined) {
                saleEntryEntity.saleEntryID = element.saleEntryID;
                yield db_manager_1.AppDataSource.getRepository(items_schema_1.SaleEntry).save(saleEntryEntity);
            }
            else {
                yield db_manager_1.AppDataSource.getRepository(items_schema_1.SaleEntry).update({
                    saleEntryID: element.saleEntryID
                }, Object.assign({}, saleEntryEntity));
            }
        }
        return res;
    });
}
exports.updateSale = updateSale;
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
            .delete(saleEntry);
    });
}
exports.deleteSaleEntry = deleteSaleEntry;
function insertSaleTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO : Inserting sale transaction data");
        const saleEntity = new items_schema_1.Sales();
        saleEntity.salesID = transaction.sales.salesID;
        saleEntity.saleType = transaction.sales.saleType;
        saleEntity.remarks = transaction.sales.remarks;
        const saleTransactionEntity = new items_schema_1.SaleTransaction();
        saleTransactionEntity.sale = saleEntity;
        saleTransactionEntity.transactionType = transaction.transactionType;
        saleTransactionEntity.transactionAmount = transaction.transactionAmount;
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
            transactionType: transaction.transactionType,
            transactionAmount: transaction.transactionAmount,
            transactionDate: transaction.transactionDate,
            remarks: transaction.remarks
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