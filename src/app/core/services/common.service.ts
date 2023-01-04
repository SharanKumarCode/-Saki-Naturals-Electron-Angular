import { Injectable } from '@angular/core';
import { ISaleTransactions, EnumTransactionType } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  sortSalesTransactionByTypeAndDate(saleTransactions: ISaleTransactions[]): ISaleTransactions[]{

    const tmpTransactAdvance = saleTransactions
                                .filter(d=>d.transactionType === EnumTransactionType.advance)
                                .sort((a,b)=>b.transactionDate.getTime() - a.transactionDate.getTime()).reverse();
    const tmpTransactPaid = saleTransactions
                              .filter(d=>d.transactionType === EnumTransactionType.paid)
                              .sort((a,b)=>b.transactionDate.getTime() - a.transactionDate.getTime()).reverse();
    const tmpTransactRefund = saleTransactions
                              .filter(d=>d.transactionType === EnumTransactionType.refund)
                              .sort((a,b)=>b.transactionDate.getTime() - a.transactionDate.getTime()).reverse();
    saleTransactions = tmpTransactAdvance.length > 0 ? tmpTransactAdvance : [];
    saleTransactions.push(...tmpTransactPaid);
    saleTransactions.push(...tmpTransactRefund);

    return saleTransactions;

   }
}
