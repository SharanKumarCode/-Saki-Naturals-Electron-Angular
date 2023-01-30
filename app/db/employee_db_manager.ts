import { IAttendanceEntry, IEmployeeData, ISalaryTransaction } from "../../src/app/core/interfaces/interfaces";
import { AttendanceEntry, Employee, SalaryTransaction } from "./data/models/employee-items.schema";
import { AppDataSource } from "./db_manager";

async function getAllEmployee(){
    console.log('INFO : Getting employee data')

    const res = await AppDataSource.getRepository(Employee).find(
        {
            relations: {
                employeeAttendanceEntries: true,
                employeeSalaryEntries: true
        }
        }
    )

    return res
}

async function getEmployeeByID(employeeID: string){
    console.log("INFO : Getting employee data by ID")
    const res = await AppDataSource.getRepository(Employee).find(
        {
            relations: {
                employeeAttendanceEntries: true,
                employeeSalaryEntries: true
        },
            where: {
                employeeID: employeeID
            }
        }
    )

    return res
}

async function softDeleteEmployee(employeeID: string){
    console.log("INFO: Soft deleting employee by ID")
    const res = await AppDataSource.manager.update(Employee, {
        employeeID: employeeID
    }, {
        deleteFlag: true
    })
    return res
}

async function unDeleteEmployee(employeeID: string){
    console.log("INFO: reverting deleted employee by ID")
    const res = await AppDataSource.manager.update(Employee, {
        employeeID: employeeID
    }, {
        deleteFlag: false
    })
    return res
}


async function deleteEmployee(employeeID: string){
    console.log("INFO: Hard deleting employee by ID")
    const res = await AppDataSource.manager.delete(Employee, {
        employeeID: employeeID
    })
    return res
}

async function insertEmployee(employeeData: IEmployeeData){
    console.log("INFO: Inserting employee data")
    console.log(employeeData)
    const employeeEntity = new Employee()
    const ignoreEmployeePropList = ['editCreate', 'deleteFlag', 'createdDate', 'employeeID', 'employeeSalaryEntries', 'employeeAttendanceEntries']
    if (!employeeData.exitDate) {
        ignoreEmployeePropList.push('exitDate');
    }
    for (let index = 0; index < Object.keys(employeeData).length; index++) {
        if (!(ignoreEmployeePropList.includes(Object.keys(employeeData)[index]))) {
            employeeEntity[Object.keys(employeeData)[index]] = employeeData[Object.keys(employeeData)[index]];
        }
        
    }

    console.log(employeeEntity);
    
    return await AppDataSource.getRepository(Employee).save(employeeEntity)
}

async function updateEmployee(employeeData: IEmployeeData){
    console.log("INFO: Updating employee data")
    
    const employeeEntity = new Employee()
    const ignoreEmployeePropList = ['editCreate', 'deleteFlag', 'createdDate', 'employeeSalaryEntries', 'employeeAttendanceEntries']
    for (let index = 0; index < Object.keys(employeeData).length; index++) {
        if (!(ignoreEmployeePropList.includes(Object.keys(employeeData)[index]))) {
            employeeEntity[Object.keys(employeeData)[index]] = employeeData[Object.keys(employeeData)[index]];
        }
        
    }
    
    return await AppDataSource.manager.update(Employee,
        {
            employeeID: employeeData.employeeID
        },
        {
            ...employeeEntity
    })
}


async function insertAttendanceEntry(attendanceEntry: IAttendanceEntry) {
    console.log("INFO : Inserting attendance entry data")

    const employeeEntity = new Employee()
    const ignoreEmployeePropList = ['editCreate', 'deleteFlag', 'createdDate', 'employeeSalaryEntries', 'employeeAttendanceEntries']
    for (let index = 0; index < Object.keys(attendanceEntry.employee).length; index++) {
        if (!(ignoreEmployeePropList.includes(Object.keys(attendanceEntry.employee)[index]))) {
            employeeEntity[Object.keys(attendanceEntry.employee)[index]] = attendanceEntry.employee[Object.keys(attendanceEntry.employee)[index]];
        }
        
    }

    const attendanceEntryEntity = new AttendanceEntry()
    attendanceEntryEntity.date = attendanceEntry.date.toDateString();
    attendanceEntryEntity.employee = employeeEntity
    attendanceEntryEntity.status = attendanceEntry.status
    attendanceEntryEntity.remarks = attendanceEntry.remarks

    return await AppDataSource.getRepository(AttendanceEntry).save(attendanceEntryEntity)
}

async function updateAttendanceEntry(attendanceEntry: IAttendanceEntry) {
    console.log("INFO : Updating attendance entry data")

    const employeeEntity = new Employee()
    const ignoreEmployeePropList = ['editCreate', 'deleteFlag', 'createdDate', 'employeeSalaryEntries', 'employeeAttendanceEntries']
    for (let index = 0; index < Object.keys(attendanceEntry.employee).length; index++) {
        if (!(ignoreEmployeePropList.includes(Object.keys(attendanceEntry.employee)[index]))) {
            employeeEntity[Object.keys(attendanceEntry.employee)[index]] = attendanceEntry.employee[Object.keys(attendanceEntry.employee)[index]];
        }
        
    }

    const attendanceEntryEntity = new AttendanceEntry()
    attendanceEntryEntity.attendanceEntryID = attendanceEntry.attendanceEntryID
    attendanceEntryEntity.date = attendanceEntry.date.toDateString();
    attendanceEntryEntity.employee = employeeEntity
    attendanceEntryEntity.status = attendanceEntry.status
    attendanceEntryEntity.remarks = attendanceEntry.remarks

    return await AppDataSource.manager.update(AttendanceEntry,
        {
            attendanceEntryID: attendanceEntry.attendanceEntryID
        },
        {
            ...attendanceEntryEntity
    })
}


async function deleteAttendanceEntry(attendanceEntry) {
    console.log("INFO : Deleting employee entry data")
    return await AppDataSource
                    .getRepository(AttendanceEntry)
                    .delete(attendanceEntry)
    
}


async function insertSalaryTransaction(transaction: ISalaryTransaction){
    console.log("INFO : Inserting salary transaction data")

    const employeeEntity = new Employee()
    const ignoreEmployeePropList = ['editCreate', 'deleteFlag', 'createdDate', 'employeeSalaryEntries', 'employeeAttendanceEntries']
    for (let index = 0; index < Object.keys(transaction.employee).length; index++) {
        if (!(ignoreEmployeePropList.includes(Object.keys(transaction.employee)[index]))) {
            employeeEntity[Object.keys(transaction.employee)[index]] = transaction.employee[Object.keys(transaction.employee)[index]];
        }
        
    }

    const salaryTransactionEntity = new SalaryTransaction()
    salaryTransactionEntity.employee = employeeEntity
    salaryTransactionEntity.transactionType = transaction.transactionType
    salaryTransactionEntity.amount = transaction.amount
    salaryTransactionEntity.transactionDate = transaction.transactionDate
    salaryTransactionEntity.remarks = transaction.remarks

    return await AppDataSource.getRepository(SalaryTransaction).save(salaryTransactionEntity)
}

async function updateSalaryTransaction(transaction: ISalaryTransaction){
    console.log("INFO : Updating salary transaction data")

    const employeeEntity = new Employee()
    const ignoreEmployeePropList = ['editCreate', 'deleteFlag', 'createdDate', 'employeeSalaryEntries', 'employeeAttendanceEntries']
    for (let index = 0; index < Object.keys(transaction.employee).length; index++) {
        if (!(ignoreEmployeePropList.includes(Object.keys(transaction.employee)[index]))) {
            employeeEntity[Object.keys(transaction.employee)[index]] = transaction.employee[Object.keys(transaction.employee)[index]];
        }
        
    }

    const salaryTransactionEntity = new SalaryTransaction()
    salaryTransactionEntity.salaryTransactionID = transaction.salaryTransactionID
    salaryTransactionEntity.employee = employeeEntity
    salaryTransactionEntity.transactionType = transaction.transactionType
    salaryTransactionEntity.amount = transaction.amount
    salaryTransactionEntity.transactionDate = transaction.transactionDate
    salaryTransactionEntity.remarks = transaction.remarks

    return await AppDataSource.manager.update(SalaryTransaction,
        {
            salaryTransactionID: transaction.salaryTransactionID
        },
        {
            ...salaryTransactionEntity
    })
}


async function deleteSalaryTransaction(transactionID: string){
    console.log("INFO : Deleting salary transaction data..")
    return await AppDataSource.manager.delete(SalaryTransaction, {
        salaryTransactionID: transactionID
    })
}

export {
    getAllEmployee, 
    getEmployeeByID,
    softDeleteEmployee, 
    unDeleteEmployee, 
    deleteEmployee, 
    insertEmployee,
    updateEmployee,
    insertAttendanceEntry,
    updateAttendanceEntry,
    deleteAttendanceEntry,
    insertSalaryTransaction,
    updateSalaryTransaction,
    deleteSalaryTransaction
}