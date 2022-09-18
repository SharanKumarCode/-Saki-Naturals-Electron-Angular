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
exports.Supplier = exports.Purchaser = exports.SaleTransactions = exports.SaleEntry = exports.Sales = exports.Product = void 0;
const { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } = require('typeorm');
let Product = class Product {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Product.prototype, "productID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "productGroup", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "productName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "priceDirectSale", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "priceReseller", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "priceDealer", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "remarks", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "createdDate", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Product.prototype, "deleteFlag", void 0);
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
    ManyToOne(() => Product, (product) => product.productID),
    __metadata("design:type", String)
], Sales.prototype, "productID", void 0);
__decorate([
    ManyToOne(() => Purchaser, (purchaser) => purchaser.purchaserID),
    __metadata("design:type", String)
], Sales.prototype, "purchaserID", void 0);
__decorate([
    ManyToOne(() => Supplier, (supplier) => supplier.supplierID),
    __metadata("design:type", String)
], Sales.prototype, "supplierID", void 0);
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
let SaleEntry = class SaleEntry {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SaleEntry.prototype, "entryID", void 0);
__decorate([
    ManyToOne(() => Sales, (sales) => sales.salesID, {
        onDelete: "CASCADE"
    }),
    __metadata("design:type", String)
], SaleEntry.prototype, "salesID", void 0);
__decorate([
    ManyToOne(() => Product, (product) => product.productID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], SaleEntry.prototype, "productID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], SaleEntry.prototype, "saleType", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleEntry.prototype, "sellingPrice", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleEntry.prototype, "sellingQuantity", void 0);
SaleEntry = __decorate([
    Entity()
], SaleEntry);
exports.SaleEntry = SaleEntry;
let SaleTransactions = class SaleTransactions {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SaleTransactions.prototype, "transactionID", void 0);
__decorate([
    ManyToOne(() => Sales, (sales) => sales.salesID, {
        onDelete: "CASCADE"
    }),
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
let Purchaser = class Purchaser {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Purchaser.prototype, "purchaserID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Purchaser.prototype, "purchaserName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Purchaser.prototype, "createdDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Purchaser.prototype, "location", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Purchaser.prototype, "contact", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Purchaser.prototype, "remarks", void 0);
Purchaser = __decorate([
    Entity()
], Purchaser);
exports.Purchaser = Purchaser;
let Supplier = class Supplier {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Supplier.prototype, "supplierID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Supplier.prototype, "supplierName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Supplier.prototype, "createdDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Supplier.prototype, "location", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Supplier.prototype, "contact", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Supplier.prototype, "remarks", void 0);
Supplier = __decorate([
    Entity()
], Supplier);
exports.Supplier = Supplier;
//# sourceMappingURL=items.schema.js.map