import { ITransactionEntry, ITransactionTypeData } from '../../src/app/core/interfaces/interfaces';
import { TransactionEntry, TransactionType } from './data/models/transaction-items.schema';
import { AppDataSource } from './db_manager';


async function getTransactionEntryByTransactionTypeID(transactionTypeID: string){
    console.log('INFO : Getting transaction entry by Type ID')
    const transactionTypeEntity = new TransactionType()
    transactionTypeEntity.transactionTypeID = transactionTypeID

    const res = await AppDataSource.getRepository(TransactionEntry).find(
        {
            where: {
                transactionType: transactionTypeEntity
            }
        }
    )

    return res
}

async function getAllTransactionTypes() {
    console.log('INFO : Getting all transaction types')
    const res = await AppDataSource.manager
                    .createQueryBuilder(TransactionType, "transactionType")
                    .getMany()
    return res
}

async function insertTransactionType(transactionTypeData: ITransactionTypeData) {
    console.log('INFO : Inserting transaction type')
    return await AppDataSource.manager.insert(TransactionType, {
        transactionGroup: transactionTypeData.transactionGroup,
        transactionName: transactionTypeData.transactionName
    })
}

async function softDeleteTransactionType(transactionTypeID: string){
    console.log("INFO: Soft deleting transcation type by ID")
    const res = await AppDataSource.manager.update(TransactionType, {
        transactionTypeID: transactionTypeID
    }, {
        deleteFlag: true
    })
    return res
}

async function hardDeleteTransactionType(transactionTypeID: string){
    console.log("INFO: Hard deleting transcation type")
    const res = await AppDataSource.manager.delete(TransactionType, {
        transactionTypeID: transactionTypeID
    })
    return res
}

async function getAllTransactionEntries() {
    console.log('INFO : Getting all transaction entries')

    const res = await AppDataSource.getRepository(TransactionEntry).find(
        {
            relations: {
                transactionType: true
            }
        }
    )

    return res
}

async function insertTransactionEntry(transactionEntryData: ITransactionEntry) {
    console.log('INFO : Inserting transaction entry')
    const transactionTypeEntity = new TransactionType();
    transactionTypeEntity.transactionTypeID = transactionEntryData.transactionType.transactionTypeID
    transactionTypeEntity.transactionGroup = transactionEntryData.transactionType.transactionGroup
    transactionTypeEntity.transactionName = transactionEntryData.transactionType.transactionName

    return await AppDataSource.manager.insert(TransactionEntry, {
        transactionType: transactionTypeEntity,
        transactionDate: transactionEntryData.transactionDate.toDateString(),
        transactionAmount: transactionEntryData.transactionAmount,
        remarks: transactionEntryData.remarks
    })
}

async function updateTransactionEntry(transactionEntryData: ITransactionEntry) {
    console.log('INFO : Updating transaction entry')
    const transactionTypeEntity = new TransactionType();
    transactionTypeEntity.transactionTypeID = transactionEntryData.transactionType.transactionTypeID
    transactionTypeEntity.transactionGroup = transactionEntryData.transactionType.transactionGroup
    transactionTypeEntity.transactionName = transactionEntryData.transactionType.transactionName
    return await AppDataSource.manager.update(TransactionEntry, 
        {
            transactionEntryID: transactionEntryData.transactionEntryID
    },
        {
        transactionType: transactionTypeEntity,
        transactionDate: transactionEntryData.transactionDate.toDateString(),
        transactionAmount: transactionEntryData.transactionAmount,
        remarks: transactionEntryData.remarks
    })
}

async function deleteTransactionEntry(transactionEntryID: string) {
    console.log('INFO : Deleting transaction entry')
    return await AppDataSource.manager.delete(TransactionEntry,
        {
            transactionEntryID: transactionEntryID
        })
    
}

export { 
        getTransactionEntryByTransactionTypeID,
        getAllTransactionTypes,
        insertTransactionType, 
        softDeleteTransactionType, 
        hardDeleteTransactionType,
        getAllTransactionEntries,
        insertTransactionEntry,
        updateTransactionEntry,
        deleteTransactionEntry
     }