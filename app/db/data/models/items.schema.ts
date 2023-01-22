import { CreateDateColumn, OneToMany, PrimaryColumn } from "typeorm";

const { Entity, PrimaryGeneratedColumn, Column, ManyToOne } = require('typeorm');

@Entity()
export class Company
{
	@PrimaryGeneratedColumn('uuid')
	companyID: string;

    @Column()
	companyName: string;

	@Column()
	description: string;

	@Column()
	contact1: string;

	@Column()
	contact2: string;

	@Column()
	contact3: string;

	@Column()
	address: string;

	@CreateDateColumn()
	createdDate: Date;

	@Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;
}

@Entity()
export class Employee
{
	@PrimaryGeneratedColumn('uuid')
	employeeID: string;

    @Column()
	employeeName: string;

	@Column()
	role: string;

	@Column({
		type: 'date'
	})
	dob: string

	@Column({
		type: 'date'
	})
	joiningDate: string

	@Column({
		type: 'date'
	})
	exitDate: string

	@Column()
	salary: number;

	@Column()
	salaryFrequency: string;

	@Column()
	contact1: string;

	@Column()
	contact2: string;

	@Column()
	address: string;

	@CreateDateColumn()
	createdDate: Date;

	@Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;
}

@Entity()
export class EmployeeTransaction
{
	@PrimaryGeneratedColumn('uuid')
	transactionID: string;

	// @PrimaryColumn()
	// @ManyToOne(() => Employee, (employee)=>employee.employeeID, {
	// 	onDelete: "RESTRICT"
	// })
	// employeeID: Employee;

	@Column()
	transactionType: string;

    @Column()
	amount: number;

    @Column({
		type: 'datetime'
	})
	transactionDate: Date;

    @Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;

}

@Entity()
export class ProductGroup
{
	@PrimaryGeneratedColumn('uuid')
	productGroupID: string;

	@Column()
	productGroupName: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;

	@OneToMany(()=>Product, (product)=>product.productGroup)
	products: Product[]

}

@Entity()
export class Client
{
	@PrimaryGeneratedColumn('uuid')
	clientID: string;

	@OneToMany(()=>Sales, (sales)=>sales.customer)
	sales: Sales[]

	@OneToMany(()=>Purchase, (purchase)=>purchase.supplier)
	purchases: Purchase[]

	@Column()
	clientType: string;

    @Column()
	clientName: string;

	@Column()
	contactPerson: string;

	@Column()
	description: string;

	@Column()
	contact1: string;

	@Column()
	contact2: string;

	@Column()
	landline: string;

	@Column()
	email: string;

	@Column()
	addressLine1: string;

	@Column()
	addressLine2: string;

	@Column()
	city: string;

	@Column()
	state: string;

	@Column()
	country: string;

	@Column()
	pincode: string;

	@CreateDateColumn()
	createdDate: Date;

	@Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;
}


@Entity()
export class Product
{
	@PrimaryGeneratedColumn('uuid')
	productID: string;

	@ManyToOne(()=>ProductGroup, (productGroup)=>productGroup.products)
	productGroup: ProductGroup;

	@OneToMany(()=>SaleEntry, (saleEntry)=>saleEntry.product)
	saleEntries: SaleEntry[]

    @OneToMany(()=>Production, (production)=>production.product)
    production: Production[]

    @Column()
	productName: string;

    @Column()
	description: string;

    @Column()
	priceDirectSale: number;

    @Column()
	priceReseller: number;

    @Column()
	priceDealer: number;

	@Column()
	remarks: string;

    @CreateDateColumn()
	createdDate: Date;

	@Column({
		default: false
	})
	deleteFlag: boolean;

}



@Entity()
export class Sales
{
	@PrimaryGeneratedColumn('uuid')
	salesID: string;

    @ManyToOne(()=>Client, (client)=>client.sales)
	customer: Client;

	@OneToMany(()=>SaleEntry, (saleEntry)=>saleEntry.sale)
	saleEntries: SaleEntry[];

	@OneToMany(()=>SaleTransaction, (saleTransaction)=>saleTransaction.sale)
	saleTransactions: SaleTransaction[];

    @Column()
	saleType: string;

	@Column()
	overallDiscountPercentage: number;

	@Column()
	gstPercentage: number;

	@Column()
	transportCharges: number;

	@Column()
	miscCharges: number;

	@Column()
	paymentTerms: number;

	@Column({
		type: 'datetime'
	})
	salesDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	dispatchDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	deliveredDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	returnedDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	refundedDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	completedDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	cancelledDate: Date;

	@Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;
}

@Entity()
export class SaleEntry
{
	
	@ManyToOne(() => Sales, (sales)=>sales.saleEntries)
	sale: Sales;

	@ManyToOne(() => Product, (product)=>product.saleEntries)
	product: Product;

	@PrimaryGeneratedColumn('uuid')
	saleEntryID: string;

    @Column()
	price: number;

    @Column()
	quantity: number;

	@Column()
	discountPercentage: number;

	@Column({
		default: false
	})
	returnFlag: boolean

}

@Entity()
export class SaleTransaction
{
	@PrimaryGeneratedColumn('uuid')
	transactionID: string;

	@ManyToOne(() => Sales, (sales)=>sales.saleTransactions)
	sale: Sales;

	@Column()
	transactionType: string;

    @Column()
	transactionAmount: number;

    @Column({
		type: 'datetime'
	})
	transactionDate: Date;

    @Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;

}

@Entity()
export class Material
{
	@PrimaryGeneratedColumn('uuid')
	materialID: string;

    @OneToMany(()=>ProductionEntry, (productionEntry)=>productionEntry.material)
    productionEntries: ProductionEntry[]

    @OneToMany(()=>PurchaseEntry, (purchaseEntry)=>purchaseEntry.material)
    purchaseEntries: PurchaseEntry[]

    @Column()
	materialName: string;

    @Column()
	description: string;

	@Column()
	remarks: string;

    @CreateDateColumn()
	createdDate: Date;

	@Column({
		default: false
	})
	deleteFlag: boolean;

}

@Entity()
export class Purchase
{
	@PrimaryGeneratedColumn('uuid')
	purchaseID: string;

    @ManyToOne(()=>Client, (client)=>client.purchases)
	supplier: Client;

    @OneToMany(()=>PurchaseEntry, (purchaseEntry)=>purchaseEntry.purchase)
    purchaseEntries: PurchaseEntry[]

    @OneToMany(()=>PurchaseTransaction, (purchaseTransaction)=>purchaseTransaction.purchase)
    purchaseTransactions: PurchaseTransaction[]

	@Column()
	overallDiscountPercentage: number;

	@Column()
	gstPercentage: number;

	@Column()
	transportCharges: number;

	@Column()
	miscCharges: number;

	@Column()
	paymentTerms: number;

	@Column({
		type: 'datetime'
	})
	purchaseDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	dispatchDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	deliveredDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	returnedDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	refundedDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	completedDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	cancelledDate: Date;

	@Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;
}

@Entity()
export class PurchaseEntry
{
	
	@ManyToOne(() => Purchase, (purchase)=>purchase.purchaseEntries)
	purchase: Purchase;

	@ManyToOne(() => Material, (material)=>material.purchaseEntries)
	material: Material;

	@PrimaryGeneratedColumn('uuid')
	purchaseEntryID: string;

    @Column()
	price: number;

    @Column()
	quantity: number;

	@Column()
	discountPercentage: number;

	@Column({
		default: false
	})
	returnFlag: boolean

}


@Entity()
export class PurchaseTransaction
{
	@PrimaryGeneratedColumn('uuid')
	transactionID: string;

	@ManyToOne(() => Purchase, (purchase)=>purchase.purchaseTransactions)
	purchase: Purchase;

	@Column()
	transactionType: string;

    @Column()
	transactionAmount: number;

    @Column({
		type: 'datetime'
	})
	transactionDate: Date;

    @Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;

}

@Entity()
export class Production
{
	@PrimaryGeneratedColumn('uuid')
	productionID: string;

    @OneToMany(()=>ProductionEntry, (productionEntry)=>productionEntry.production)
    productionEntries: ProductionEntry[]

	@ManyToOne(() => Product, (product)=>product.production)
	product: Product;

    @Column({
		type: 'datetime'
	})
	productionDate: Date;

	@Column()
	productQuantity: number;

	@Column({
		type: 'date',
		nullable: true
	})
	completedDate: Date;

	@Column({
		type: 'date',
		nullable: true
	})
	cancelledDate: Date;

	@Column()
	remarks: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;
}

@Entity()
export class ProductionEntry
{
	@ManyToOne(() => Production, (production)=>production.productionEntries)
	production: Production;
	
	@ManyToOne(() => Material, (material)=>material.productionEntries)
	material: Material;

	@PrimaryGeneratedColumn('uuid')
	productionEntryID: string;

	@Column()
	materialQuantity: number;

}