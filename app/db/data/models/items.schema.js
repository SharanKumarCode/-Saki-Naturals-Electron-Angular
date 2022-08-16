"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleTransactions = exports.Sales = exports.Product = void 0;
const { Entity, PrimaryGeneratedColumn, Column } = require('typeorm');
let Product = class Product {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Product.prototype, "product_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "group", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "product_name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "price_directSale", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "price_reseller", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "price_dealer", void 0);
__decorate([
    Column(),
    __metadata("design:type", Date)
], Product.prototype, "created_date", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "sold", void 0);
Product = __decorate([
    Entity()
], Product);
exports.Product = Product;
let Sales = class Sales {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Sales.prototype, "salesID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "productID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "purchaser", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "supplier", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "saleType", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Sales.prototype, "sellingPrice", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Sales.prototype, "sellingQuantity", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "remarks", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "saleDate", void 0);
Sales = __decorate([
    Entity()
], Sales);
exports.Sales = Sales;
let SaleTransactions = class SaleTransactions {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SaleTransactions.prototype, "transactionID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], SaleTransactions.prototype, "salesID", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleTransactions.prototype, "paid", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], SaleTransactions.prototype, "transactionDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], SaleTransactions.prototype, "remarks", void 0);
SaleTransactions = __decorate([
    Entity()
], SaleTransactions);
exports.SaleTransactions = SaleTransactions;
//# sourceMappingURL=items.schema.js.map