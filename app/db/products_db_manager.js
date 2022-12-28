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
exports.hardDeleteProductGroup = exports.softDeleteProductGroup = exports.insertProductGroup = exports.getAllProductGroups = exports.hardDeleteProduct = exports.softDeleteProduct = exports.updateProduct = exports.insertProduct = exports.getProductByProductGroupID = exports.getProductByID = exports.getAllProducts = void 0;
const db_manager_1 = require("./db_manager");
const items_schema_1 = require("./data/models/items.schema");
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting all products');
        const res = yield db_manager_1.AppDataSource.manager
            .getRepository(items_schema_1.Product).find({
            relations: {
                productGroup: true,
            }
        });
        return res;
    });
}
exports.getAllProducts = getAllProducts;
function getProductByID(productID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting product by ID');
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.Product).find({
            where: {
                productID: productID
            },
            relations: {
                productGroup: true
            }
        });
        return res;
    });
}
exports.getProductByID = getProductByID;
function getProductByProductGroupID(productGroupID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting product by Group ID');
        const productGroupEntity = new items_schema_1.ProductGroup();
        productGroupEntity.productGroupID = productGroupID;
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.Product).find({
            where: {
                productGroup: productGroupEntity
            }
        });
        return res;
    });
}
exports.getProductByProductGroupID = getProductByProductGroupID;
function insertProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Inserting product data");
        const productGroupEntity = new items_schema_1.ProductGroup();
        productGroupEntity.productGroupID = product.productGroupID;
        productGroupEntity.productGroupName = product.productGroupName;
        const res = yield db_manager_1.AppDataSource.manager.insert(items_schema_1.Product, {
            productGroup: productGroupEntity,
            productName: product.productName,
            description: product.description,
            priceDirectSale: product.priceDirectSale,
            priceReseller: product.priceReseller,
            priceDealer: product.priceDealer,
            remarks: product.remarks
        });
        return res;
    });
}
exports.insertProduct = insertProduct;
function updateProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Updating product data");
        const productGroupEntity = new items_schema_1.ProductGroup();
        productGroupEntity.productGroupID = product.productGroupID;
        productGroupEntity.productGroupName = product.productGroupName;
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Product, {
            productID: product.productID
        }, {
            productGroup: productGroupEntity,
            productName: product.productName,
            description: product.description,
            priceDirectSale: product.priceDirectSale,
            priceReseller: product.priceReseller,
            priceDealer: product.priceDealer,
            remarks: product.remarks
        });
        return res;
    });
}
exports.updateProduct = updateProduct;
function softDeleteProduct(productID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Soft deleting product by ID");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Product, {
            productID: productID
        }, {
            deleteFlag: true
        });
        return res;
    });
}
exports.softDeleteProduct = softDeleteProduct;
function hardDeleteProduct(productID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Hard deleting product data");
        const res = yield db_manager_1.AppDataSource.manager.delete(items_schema_1.Product, {
            productID: productID
        });
        return res;
    });
}
exports.hardDeleteProduct = hardDeleteProduct;
function getAllProductGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting all product groups');
        const res = yield db_manager_1.AppDataSource.manager
            .createQueryBuilder(items_schema_1.ProductGroup, "productGroup")
            .getMany();
        return res;
    });
}
exports.getAllProductGroups = getAllProductGroups;
function insertProductGroup(productGroupData) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Inserting product group');
        const res = yield db_manager_1.AppDataSource.manager.insert(items_schema_1.ProductGroup, {
            productGroupName: productGroupData.productGroupName,
        });
        return res;
    });
}
exports.insertProductGroup = insertProductGroup;
function softDeleteProductGroup(productGroupID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Soft deleting product group by ID");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.ProductGroup, {
            productGroupID: productGroupID
        }, {
            deleteFlag: true
        });
        return res;
    });
}
exports.softDeleteProductGroup = softDeleteProductGroup;
function hardDeleteProductGroup(productGroupID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Hard deleting product group");
        const res = yield db_manager_1.AppDataSource.manager.delete(items_schema_1.ProductGroup, {
            productGroupID: productGroupID
        });
        return res;
    });
}
exports.hardDeleteProductGroup = hardDeleteProductGroup;
//# sourceMappingURL=products_db_manager.js.map