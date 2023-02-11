import { ManyToOne, PrimaryGeneratedColumn, Column, Entity, OneToMany, CreateDateColumn } from "typeorm";

@Entity()
export class Employee
{
	@PrimaryGeneratedColumn('uuid')
	employeeID: string;

	@OneToMany(()=>SalaryTransaction, (salaryTransaction)=>salaryTransaction.employee)
	employeeSalaryEntries: SalaryTransaction[];

	@OneToMany(()=>AttendanceEntry, (attendanceEntry)=>attendanceEntry.employee)
	employeeAttendanceEntries: AttendanceEntry[];

    @Column()
	employeeName: string;

	@Column()
	role: string;

	@Column({
		type: 'date'
	})
	dob: string

	@Column()
	gender: string;

	@Column()
	aadhar: string;

	@Column({
		type: 'date'
	})
	joiningDate: string

	@Column({
		type: 'date',
		nullable: true
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

	@Column()
	email: string;

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
export class AttendanceEntry
{
	
	@ManyToOne(() => Employee, (sales)=>sales.employeeAttendanceEntries)
	employee: Employee;

	@PrimaryGeneratedColumn('uuid')
	attendanceEntryID: string;

    @Column({
		type: 'date'
	})
	date: string

    @Column()
	status: string

	@Column()
	remarks: string;

}

@Entity()
export class SalaryTransaction
{
	@PrimaryGeneratedColumn('uuid')
	salaryTransactionID: string;

	@ManyToOne(() => Employee, (sales)=>sales.employeeSalaryEntries)
	employee: Employee;

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