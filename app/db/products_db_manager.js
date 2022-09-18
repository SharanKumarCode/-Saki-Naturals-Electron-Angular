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
exports.deleteProduct = exports.updateProduct = exports.insertProduct = exports.getProductByID = exports.getAllProducts = void 0;
const db_manager_1 = require("./db_manager");
const items_schema_1 = require("./data/models/items.schema");
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting all products..');
        const res = yield db_manager_1.AppDataSource.manager
            .createQueryBuilder(items_schema_1.Product, "product")
            .getMany();
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
            }
        });
        return res;
    });
}
exports.getProductByID = getProductByID;
function insertProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Inserting product data..");
        const res = yield db_manager_1.AppDataSource.manager.insert(items_schema_1.Product, {
            productGroup: product.group,
            productName: product.productName,
            description: product.description,
            priceDirectSale: product.priceDirectSale,
            priceReseller: product.priceReseller,
            priceDealer: product.priceDealer,
            createdDate: product.createdDate
        });
        return res;
    });
}
exports.insertProduct = insertProduct;
function updateProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Updating product data..");
        console.log(product);
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Product, {
            product_id: product.productID
        }, {
            productGroup: product.group,
            productName: product.productName,
            description: product.description,
            priceDirectSale: product.priceDirectSale,
            priceReseller: product.priceReseller,
            priceDealer: product.priceDealer,
            createdDate: product.createdDate
        });
        return res;
    });
}
exports.updateProduct = updateProduct;
function deleteProduct(product_ID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Deleting product data..");
        const res = yield db_manager_1.AppDataSource.manager.delete(items_schema_1.Product, {
            product_id: product_ID
        });
        return res;
    });
}
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=products_db_manager.js.map