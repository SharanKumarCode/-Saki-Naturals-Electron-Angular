import { SalaryTransaction } from "./data/models/employee-items.schema";
import { PurchaseTransaction, SaleTransaction } from "./data/models/items.schema";
import { TransactionEntry } from "./data/models/transaction-items.schema";
import { AppDataSource } from "./db_manager";

async function getAllTransactionsDashboard(){
    console.log('INFO : Getting all transactions')

    const queryRunner = AppDataSource.createQueryRunner();

    // establish real database connection using new query runner
    await queryRunner.connect();

    // open a new transaction:
    await queryRunner.startTransaction();

    try {
        const salesTransactions = await queryRunner.manager.find(SaleTransaction);
        const purchaseTransactions = await queryRunner.manager.find(PurchaseTransaction);
        const salaryTransactions = await queryRunner.manager.find(SalaryTransaction);
        const otherTransactions = await queryRunner.manager.find(TransactionEntry, {
          relations: {
              transactionType: true
          }
      });
      
        // commit transaction:
        await queryRunner.commitTransaction();

        return {
            salesTransactions: salesTransactions,
            purchaseTransactions: purchaseTransactions,
            salaryTransactions: salaryTransactions,
            otherTransactions: otherTransactions
        }
      } catch (err) {
        // rollback changes
        await queryRunner.rollbackTransaction();

        return err;
      } finally {
        // release query runner:
        await queryRunner.release();
      }
}

export {
    getAllTransactionsDashboard
}