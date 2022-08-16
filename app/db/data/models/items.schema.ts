const { Entity, PrimaryGeneratedColumn, Column } = require('typeorm');

@Entity()
export class Product
{
	@PrimaryGeneratedColumn('uuid')
	product_id: string;

	@Column()
	group: string;

    @Column()
	product_name: string;

    @Column()
	description: string;
    
    @Column()
	stock: number;

    @Column()
	price_directSale: number;

    @Column()
	price_reseller: number;

    @Column()
	price_dealer: number;

    @Column()
	created_date: Date;

    @Column()
	sold: number;
}

@Entity()
export class Sales
{
	@PrimaryGeneratedColumn('uuid')
	salesID: string;

	@Column()
	productID: string;

    @Column()
	purchaser: string;

    @Column()
	supplier: string;
    
    @Column()
	saleType: string;

    @Column()
	sellingPrice: number;

    @Column()
	sellingQuantity: number;

    @Column()
	paid: number;

	@Column()
	remarks: string;

    @Column()
	saleDate: string;
}

@Entity()
export class SaleTransactions
{
	@PrimaryGeneratedColumn('uuid')
	transactionID: string;

	@Column()
	salesID: string;

    @Column()
	transactionType: string;

    @Column()
	paid: string;

    @Column()
	transactionDate: string;

    @Column()
	remarks: string;
}