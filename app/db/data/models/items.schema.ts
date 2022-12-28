import { CreateDateColumn, JoinColumn, OneToOne } from "typeorm";

const { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne } = require('typeorm');

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

}

@Entity()
export class Product
{
	@PrimaryGeneratedColumn('uuid')
	productID: string;

	@OneToOne(()=>ProductGroup)
	@JoinColumn()
	productGroup: ProductGroup;

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
export class Material
{
	@PrimaryGeneratedColumn('uuid')
	materialID: string;

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
export class Sales
{
	@PrimaryGeneratedColumn('uuid')
	salesID: string;

    @OneToOne(()=>Customer, (customer)=>customer.customerID)
	customerID: string;

    @Column()
	saleType: string;

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
	
	@PrimaryColumn()
	@ManyToOne(() => Sales, (sales)=>sales.salesID, {
		onDelete: "RESTRICT"
	})
	salesID: string;

	@PrimaryColumn()
	@ManyToOne(() => Product, (product)=>product.productID, {
		onDelete: "RESTRICT"
	})
	productID: string;

    @Column()
	price: number;

    @Column()
	quantity: number;

}

@Entity()
export class SaleTransaction
{
	@PrimaryGeneratedColumn('uuid')
	transactionID: string;

	@ManyToOne(() => Sales, (sales)=>sales.salesID, {
		onDelete: "RESTRICT"
	})
	salesID: string;

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
export class Production
{
	@PrimaryGeneratedColumn('uuid')
	productionID: string;

    @Column({
		type: 'datetime'
	})
	productionDate: Date;

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
	@PrimaryColumn()
	@ManyToOne(() => Production, (production)=>production.productionID, {
		onDelete: "RESTRICT"
	})
	productionID: string;

	@PrimaryColumn()
	@ManyToOne(() => Product, (product)=>product.productID, {
		onDelete: "RESTRICT"
	})
	productID: string;

	
	@PrimaryColumn()
	@ManyToOne(() => Material, (material)=>material.materialID, {
		onDelete: "RESTRICT"
	})
	materialID: string;

    @Column()
	productQuantity: number;

	@Column()
	materialQuantity: number;

}

@Entity()
export class Purchase
{
	@PrimaryGeneratedColumn('uuid')
	purchaseID: string;

    @OneToOne(()=>Supplier, (supplier)=>supplier.supplierID)
	supplierID: string;

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
	
	@PrimaryColumn()
	@ManyToOne(() => Purchase, (purchase)=>purchase.purchaseID, {
		onDelete: "RESTRICT"
	})
	purchaseID: string;

	@PrimaryColumn()
	@ManyToOne(() => Material, (material)=>material.materialID, {
		onDelete: "RESTRICT"
	})
	materialID: string;

    @Column()
	price: number;

    @Column()
	quantity: number;

}

@Entity()
export class PurchaseTransaction
{
	@PrimaryGeneratedColumn('uuid')
	transactionID: string;

	@PrimaryColumn()
	@ManyToOne(() => Purchase, (purchase)=>purchase.purchaseID, {
		onDelete: "RESTRICT"
	})
	purchaseID: string;

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
export class Customer
{
	@PrimaryGeneratedColumn('uuid')
	customerID: string;

    @Column()
	customerName: string;

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
export class Supplier
{
	@PrimaryGeneratedColumn('uuid')
	supplierID: string;

    @Column()
	supplierName: string;

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

	@PrimaryColumn()
	@ManyToOne(() => Employee, (employee)=>employee.employeeID, {
		onDelete: "RESTRICT"
	})
	employeeID: string;

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