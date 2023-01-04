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
exports.SaleTransaction = exports.SaleEntry = exports.Sales = exports.Product = exports.Client = exports.ProductGroup = exports.EmployeeTransaction = exports.Employee = exports.Company = void 0;
const typeorm_1 = require("typeorm");
const { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne } = require('typeorm');
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
__decorate([
    (0, typeorm_1.OneToMany)(() => Product, (product) => product.productGroup),
    __metadata("design:type", Array)
], ProductGroup.prototype, "products", void 0);
ProductGroup = __decorate([
    Entity()
], ProductGroup);
exports.ProductGroup = ProductGroup;
let Client = class Client {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Client.prototype, "clientID", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Sales, (sales) => sales.customer),
    __metadata("design:type", Array)
], Client.prototype, "sales", void 0);
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
let Product = class Product {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Product.prototype, "productID", void 0);
__decorate([
    ManyToOne(() => ProductGroup, (productGroup) => productGroup.products),
    __metadata("design:type", ProductGroup)
], Product.prototype, "productGroup", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SaleEntry, (saleEntry) => saleEntry.product),
    __metadata("design:type", Array)
], Product.prototype, "saleEntries", void 0);
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
let Sales = class Sales {
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Sales.prototype, "salesID", void 0);
__decorate([
    ManyToOne(() => Client, (client) => client.sales),
    __metadata("design:type", Client)
], Sales.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SaleEntry, (saleEntry) => saleEntry.sale),
    __metadata("design:type", Array)
], Sales.prototype, "saleEntries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SaleTransaction, (saleTransaction) => saleTransaction.sale),
    __metadata("design:type", Array)
], Sales.prototype, "saleTransactions", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sales.prototype, "saleType", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Sales.prototype, "overallDiscountPercentage", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Sales.prototype, "gstPercentage", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Sales.prototype, "transportCharges", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Sales.prototype, "miscCharges", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Sales.prototype, "paymentTerms", void 0);
__decorate([
    Column({
        type: 'datetime'
    }),
    __metadata("design:type", Date)
], Sales.prototype, "salesDate", void 0);
__decorate([
    Column({
        type: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], Sales.prototype, "dispatchDate", void 0);
__decorate([
    Column({
        type: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], Sales.prototype, "deliveredDate", void 0);
__decorate([
    Column({
        type: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], Sales.prototype, "returnedDate", void 0);
__decorate([
    Column({
        type: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], Sales.prototype, "refundedDate", void 0);
__decorate([
    Column({
        type: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], Sales.prototype, "completedDate", void 0);
__decorate([
    Column({
        type: 'date',
        nullable: true
    }),
    __metadata("design:type", Date)
], Sales.prototype, "cancelledDate", void 0);
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
    ManyToOne(() => Sales, (sales) => sales.saleEntries),
    __metadata("design:type", Sales)
], SaleEntry.prototype, "sale", void 0);
__decorate([
    ManyToOne(() => Product, (product) => product.saleEntries),
    __metadata("design:type", Product)
], SaleEntry.prototype, "product", void 0);
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SaleEntry.prototype, "saleEntryID", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleEntry.prototype, "price", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleEntry.prototype, "quantity", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleEntry.prototype, "discountPercentage", void 0);
__decorate([
    Column({
        default: false
    }),
    __metadata("design:type", Boolean)
], SaleEntry.prototype, "returnFlag", void 0);
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
    ManyToOne(() => Sales, (sales) => sales.saleTransactions),
    __metadata("design:type", Sales)
], SaleTransaction.prototype, "sale", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "transactionType", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "transactionAmount", void 0);
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
// @Entity()
// export class Material
// {
// 	@PrimaryGeneratedColumn('uuid')
// 	materialID: string;
//     @OneToMany(()=>ProductionEntry, (productionEntry)=>productionEntry.material)
//     productionEntries: ProductionEntry[]
//     @OneToMany(()=>PurchaseEntry, (purchaseEntry)=>purchaseEntry.material)
//     purchaseEntries: PurchaseEntry[]
//     @Column()
// 	materialName: string;
//     @Column()
// 	description: string;
// 	@Column()
// 	remarks: string;
//     @CreateDateColumn()
// 	createdDate: Date;
// 	@Column({
// 		default: false
// 	})
// 	deleteFlag: boolean;
// }
// @Entity()
// export class Production
// {
// 	@PrimaryGeneratedColumn('uuid')
// 	productionID: string;
//     @OneToMany(()=>ProductionEntry, (productionEntry)=>productionEntry.production)
//     productionEntries: ProductionEntry[]
//     @Column({
// 		type: 'datetime'
// 	})
// 	productionDate: Date;
// 	@Column()
// 	remarks: string;
// 	@Column({
// 		default: false
// 	})
// 	deleteFlag: boolean;
// }
// @Entity()
// export class ProductionEntry
// {
// 	@PrimaryColumn()
// 	@ManyToOne(() => Production, (production)=>production.productionEntries, {
// 		onDelete: "RESTRICT"
// 	})
// 	production: Production;
// 	@PrimaryColumn()
// 	@ManyToOne(() => Product, (product)=>product.productionEntries, {
// 		onDelete: "RESTRICT"
// 	})
// 	product: Product;
// 	@PrimaryColumn()
// 	@ManyToOne(() => Material, (material)=>material.productionEntries, {
// 		onDelete: "RESTRICT"
// 	})
// 	material: Material;
//     @Column()
// 	productQuantity: number;
// 	@Column()
// 	materialQuantity: number;
// }
// @Entity()
// export class PurchaseEntry
// {
// 	@PrimaryColumn()
// 	@ManyToOne(() => Purchase, (purchase)=>purchase.purchaseEntries, {
// 		onDelete: "RESTRICT"
// 	})
// 	purchase: Purchase;
// 	@PrimaryColumn()
// 	@ManyToOne(() => Material, (material)=>material.purchaseEntries, {
// 		onDelete: "RESTRICT"
// 	})
// 	material: Material;
//     @Column()
// 	price: number;
//     @Column()
// 	quantity: number;
// }
// @Entity()
// export class PurchaseTransaction
// {
// 	@PrimaryGeneratedColumn('uuid')
// 	transactionID: string;
// 	@PrimaryColumn()
// 	@ManyToOne(() => Purchase, (purchase)=>purchase.purchaseTransactions, {
// 		onDelete: "RESTRICT"
// 	})
// 	purchase: string;
// 	@Column()
// 	transactionType: string;
//     @Column()
// 	amount: number;
//     @Column({
// 		type: 'datetime'
// 	})
// 	transactionDate: Date;
//     @Column()
// 	remarks: string;
// 	@Column({
// 		default: false
// 	})
// 	deleteFlag: boolean;
// }
// @Entity()
// export class Purchase
// {
// 	@PrimaryGeneratedColumn('uuid')
// 	purchaseID: string;
//     @ManyToOne(()=>Client, (client)=>client.purchases)
// 	supplier: Client;
//     @OneToMany(()=>PurchaseEntry, (purchaseEntry)=>purchaseEntry.purchase)
//     purchaseEntries: PurchaseEntry[]
//     @OneToMany(()=>PurchaseTransaction, (purchaseTransaction)=>purchaseTransaction.purchase)
//     purchaseTransactions: PurchaseTransaction[]
// 	@Column()
// 	remarks: string;
// 	@Column({
// 		default: false
// 	})
// 	deleteFlag: boolean;
// }
//# sourceMappingURL=items.schema.js.map