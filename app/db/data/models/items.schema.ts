const { Entity, PrimaryGeneratedColumn, Column } = require('typeorm');

@Entity()
export class Product
{
	@PrimaryGeneratedColumn('uuid')
	product_id: number;

	@Column({
        "nullable": false
    })
	group: string;

    @Column({
        "nullable": false
    })
	product_name: string;

    @Column({
        "nullable": true
    })
	description: string;
    
    @Column({
        "nullable": true
    })
	stock: Number;

    @Column({
        "nullable": true
    })
	price_directSale: Number;

    @Column({
        "nullable": true
    })
	price_reseller: Number;

    @Column({
        "nullable": true
    })
	price_dealer: Number;

    @Column({
        "nullable": true
    })
	created_date: Date;

    @Column({
        "nullable": true
    })
	sold: Number;
}