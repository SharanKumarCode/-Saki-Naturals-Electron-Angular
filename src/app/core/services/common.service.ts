import { Injectable } from '@angular/core';
import { ISaleTransactions, EnumTransactionType, IProductData } from '../interfaces/interfaces';

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

  getTotal(arrayData: number[]): number {
    return arrayData.reduce((partialSum, a) => partialSum + a, 0);
  }

  getProductSold(productData: IProductData): number {
    const soldQuantity = productData.saleEntries ? this.getTotal(productData.saleEntries.map(d=>d.quantity)) : 0;
    const returnedQuantity = productData.saleEntries ?
                            this.getTotal(productData.saleEntries.filter(d=> d.returnFlag === true).map(d=>d.quantity)) : 0;
    return soldQuantity - returnedQuantity;
  }

  getProductStock(productData: IProductData): number {
    const produced = productData.production ?
                      this.getTotal(productData.production
                      .filter(d=>d.completedDate !== null && d.cancelledDate === null).map(d=>d.productQuantity)) : 0;
    const sold = this.getProductSold(productData);

    return produced - sold;
  }

  getProductInProduction(productData: IProductData): number {
    const inProduction = productData.production ?
                      this.getTotal(productData.production
                        .filter(d=>d.completedDate === null && d.cancelledDate === null).map(d=>d.productQuantity)) : 0;

    return inProduction;
  }
}
