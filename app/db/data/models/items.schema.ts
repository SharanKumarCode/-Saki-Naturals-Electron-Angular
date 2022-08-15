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
	stock: Number;

    @Column()
	price_directSale: Number;

    @Column()
	price_reseller: Number;

    @Column()
	price_dealer: Number;

    @Column()
	created_date: Date;

    @Column()
	sold: Number;
}