const { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } = require('typeorm');

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
	remarks: string;

    @Column()
	saleDate: string;

	@OneToMany(() => SaleTransactions, (saleTransactions) => saleTransactions.sale)
    saleTransactions: SaleTransactions[]
}

@Entity()
export class SaleTransactions
{
	@PrimaryGeneratedColumn('uuid')
	transactionID: string;

	@ManyToOne(() => Sales, (sales)=>sales.saleTransactions, {
		onDelete: "CASCADE"
	})
	sale: Sales;

    // @Column()
	// transactionType: string;

    @Column()
	paid: number;

    @Column()
	transactionDate: string;

    @Column()
	remarks: string;

}