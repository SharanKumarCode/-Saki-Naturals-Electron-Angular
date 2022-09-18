const { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } = require('typeorm');

@Entity()
export class Product
{
	@PrimaryGeneratedColumn('uuid')
	productID: string;

	@Column()
	productGroup: string;

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

    @Column()
	createdDate: string;

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

	@ManyToOne(()=>Product, (product)=>product.productID)
	productID: string;

    @ManyToOne(()=>Purchaser, (purchaser)=>purchaser.purchaserID)
	purchaserID: string;

    @ManyToOne(()=>Supplier, (supplier)=>supplier.supplierID)
	supplierID: string;

	@Column()
	remarks: string;

    @Column()
	saleDate: string;
}

@Entity()
export class SaleEntry
{
	@PrimaryGeneratedColumn('uuid')
	entryID: string;

	@ManyToOne(() => Sales, (sales)=>sales.salesID, {
		onDelete: "CASCADE"
	})
	salesID: string;

	@ManyToOne(() => Product, (product)=>product.productID, {
		onDelete: "RESTRICT"
	})
	productID: string;

	@Column()
	saleType: string;

    @Column()
	sellingPrice: number;

    @Column()
	sellingQuantity: number;

}

@Entity()
export class SaleTransactions
{
	@PrimaryGeneratedColumn('uuid')
	transactionID: string;

	@ManyToOne(() => Sales, (sales)=>sales.salesID, {
		onDelete: "CASCADE"
	})
	salesID: string;

    @Column()
	paid: number;

    @Column()
	transactionDate: string;

    @Column()
	remarks: string;

}

@Entity()
export class Purchaser
{
	@PrimaryGeneratedColumn('uuid')
	purchaserID: string;

    @Column()
	purchaserName: string;

    @Column()
	createdDate: string;

	@Column()
	location: string;

	@Column()
	contact: string;

	@Column()
	remarks: string;
}

@Entity()
export class Supplier
{
	@PrimaryGeneratedColumn('uuid')
	supplierID: string;

    @Column()
	supplierName: string;

    @Column()
	createdDate: string;

	@Column()
	location: string;

	@Column()
	contact: string;

	@Column()
	remarks: string;
}