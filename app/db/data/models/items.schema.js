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
exports.EmployeeTransaction = exports.Employee = exports.Company = exports.PurchaseTransaction = exports.PurchaseEntry = exports.Purchase = exports.ProductionEntry = exports.Production = exports.SaleTransaction = exports.SaleEntry = exports.Sales = exports.Client = exports.Material = exports.Product = exports.ProductGroup = void 0;
const typeorm_1 = require("typeorm");
const { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne } = require('typeorm');
let ProductGroup = class ProductGroup {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ProductGroup.prototype, "productGroupID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ProductGroup.prototype, "productGroupName", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], ProductGroup.prototype, "deleteFlag", void 0);
ProductGroup = __decorate([
    Entity()
], ProductGroup);
exports.ProductGroup = ProductGroup;
let Product = class Product {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Product.prototype, "productID", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => ProductGroup),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", ProductGroup)
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
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
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
let Material = class Material {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Material.prototype, "materialID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Material.prototype, "materialName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Material.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Material.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Material.prototype, "createdDate", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Material.prototype, "deleteFlag", void 0);
Material = __decorate([
    Entity()
], Material);
exports.Material = Material;
let Client = class Client {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Client.prototype, "clientID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "clientType", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "clientName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "contactPerson", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "contact1", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "contact2", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "landline", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "addressLine1", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "addressLine2", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "city", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "state", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "country", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "pincode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Client.prototype, "createdDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Client.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Client.prototype, "deleteFlag", void 0);
Client = __decorate([
    Entity()
], Client);
exports.Client = Client;
let Sales = class Sales {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Sales.prototype, "salesID", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Client),
    __metadata("design:type", Client)
], Sales.prototype, "customer", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "saleType", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Sales.prototype, "deleteFlag", void 0);
Sales = __decorate([
    Entity()
], Sales);
exports.Sales = Sales;
let SaleEntry = class SaleEntry {
};
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Sales, (sales) => sales.salesID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], SaleEntry.prototype, "salesID", void 0);
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Product, (product) => product.productID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], SaleEntry.prototype, "productID", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleEntry.prototype, "price", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleEntry.prototype, "quantity", void 0);
SaleEntry = __decorate([
    Entity()
], SaleEntry);
exports.SaleEntry = SaleEntry;
let SaleTransaction = class SaleTransaction {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SaleTransaction.prototype, "transactionID", void 0);
__decorate([
    ManyToOne(() => Sales, (sales) => sales.salesID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "salesID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "transactionType", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "amount", void 0);
__decorate([
    Column({
        type: 'datetime'
    }),
    __metadata("design:type", Date)
], SaleTransaction.prototype, "transactionDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], SaleTransaction.prototype, "deleteFlag", void 0);
SaleTransaction = __decorate([
    Entity()
], SaleTransaction);
exports.SaleTransaction = SaleTransaction;
let Production = class Production {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Production.prototype, "productionID", void 0);
__decorate([
    Column({
        type: 'datetime'
    }),
    __metadata("design:type", Date)
], Production.prototype, "productionDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Production.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Production.prototype, "deleteFlag", void 0);
Production = __decorate([
    Entity()
], Production);
exports.Production = Production;
let ProductionEntry = class ProductionEntry {
};
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Production, (production) => production.productionID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], ProductionEntry.prototype, "productionID", void 0);
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Product, (product) => product.productID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], ProductionEntry.prototype, "productID", void 0);
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Material, (material) => material.materialID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], ProductionEntry.prototype, "materialID", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], ProductionEntry.prototype, "productQuantity", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], ProductionEntry.prototype, "materialQuantity", void 0);
ProductionEntry = __decorate([
    Entity()
], ProductionEntry);
exports.ProductionEntry = ProductionEntry;
let Purchase = class Purchase {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Purchase.prototype, "purchaseID", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Client),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Client)
], Purchase.prototype, "supplier", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Purchase.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Purchase.prototype, "deleteFlag", void 0);
Purchase = __decorate([
    Entity()
], Purchase);
exports.Purchase = Purchase;
let PurchaseEntry = class PurchaseEntry {
};
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Purchase, (purchase) => purchase.purchaseID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], PurchaseEntry.prototype, "purchaseID", void 0);
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Material, (material) => material.materialID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], PurchaseEntry.prototype, "materialID", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], PurchaseEntry.prototype, "price", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], PurchaseEntry.prototype, "quantity", void 0);
PurchaseEntry = __decorate([
    Entity()
], PurchaseEntry);
exports.PurchaseEntry = PurchaseEntry;
let PurchaseTransaction = class PurchaseTransaction {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PurchaseTransaction.prototype, "transactionID", void 0);
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Purchase, (purchase) => purchase.purchaseID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], PurchaseTransaction.prototype, "purchaseID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], PurchaseTransaction.prototype, "transactionType", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], PurchaseTransaction.prototype, "amount", void 0);
__decorate([
    Column({
        type: 'datetime'
    }),
    __metadata("design:type", Date)
], PurchaseTransaction.prototype, "transactionDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], PurchaseTransaction.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], PurchaseTransaction.prototype, "deleteFlag", void 0);
PurchaseTransaction = __decorate([
    Entity()
], PurchaseTransaction);
exports.PurchaseTransaction = PurchaseTransaction;
let Company = class Company {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Company.prototype, "companyID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Company.prototype, "companyName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Company.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Company.prototype, "contact1", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Company.prototype, "contact2", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Company.prototype, "contact3", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Company.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "createdDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Company.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Company.prototype, "deleteFlag", void 0);
Company = __decorate([
    Entity()
], Company);
exports.Company = Company;
let Employee = class Employee {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Employee.prototype, "employeeID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Employee.prototype, "employeeName", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Employee.prototype, "role", void 0);
__decorate([
    Column({
        type: 'date'
    }),
    __metadata("design:type", String)
], Employee.prototype, "dob", void 0);
__decorate([
    Column({
        type: 'date'
    }),
    __metadata("design:type", String)
], Employee.prototype, "joiningDate", void 0);
__decorate([
    Column({
        type: 'date'
    }),
    __metadata("design:type", String)
], Employee.prototype, "exitDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Employee.prototype, "salary", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Employee.prototype, "salaryFrequency", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Employee.prototype, "contact1", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Employee.prototype, "contact2", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Employee.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Employee.prototype, "createdDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Employee.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], Employee.prototype, "deleteFlag", void 0);
Employee = __decorate([
    Entity()
], Employee);
exports.Employee = Employee;
let EmployeeTransaction = class EmployeeTransaction {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], EmployeeTransaction.prototype, "transactionID", void 0);
__decorate([
    PrimaryColumn(),
    ManyToOne(() => Employee, (employee) => employee.employeeID, {
        onDelete: "RESTRICT"
    }),
    __metadata("design:type", String)
], EmployeeTransaction.prototype, "employeeID", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], EmployeeTransaction.prototype, "transactionType", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], EmployeeTransaction.prototype, "amount", void 0);
__decorate([
    Column({
        type: 'datetime'
    }),
    __metadata("design:type", Date)
], EmployeeTransaction.prototype, "transactionDate", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], EmployeeTransaction.prototype, "remarks", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], EmployeeTransaction.prototype, "deleteFlag", void 0);
EmployeeTransaction = __decorate([
    Entity()
], EmployeeTransaction);
exports.EmployeeTransaction = EmployeeTransaction;
//# sourceMappingURL=items.schema.js.map