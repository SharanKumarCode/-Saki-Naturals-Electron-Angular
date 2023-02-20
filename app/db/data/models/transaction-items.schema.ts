import { ManyToOne, PrimaryGeneratedColumn, Column, Entity, OneToMany } from "typeorm";

@Entity()
export class TransactionType
{
	@PrimaryGeneratedColumn('uuid')
	transactionTypeID: string;

	@Column()
	transactionGroup: string;

    @Column()
	transactionName: string;

	@Column({
		default: false
	})
	deleteFlag: boolean;

	@OneToMany(()=>TransactionEntry, (transactionEntry)=>transactionEntry.transactionType)
	transactionEntries: TransactionEntry[]

}

@Entity()
export class TransactionEntry
{
	@PrimaryGeneratedColumn('uuid')
	transactionEntryID: string;

	@Column()
	transactionAmount: number;

    @Column({
		type: 'datetime'
	})
	transactionDate: string;

    @Column()
	remarks: string;

	@ManyToOne(()=>TransactionType, (transactionType)=>transactionType.transactionEntries)
	transactionType: TransactionType

}