import { Injectable } from '@angular/core';
import { ISaleTransactions, IProductData, IMaterialData } from '../interfaces/interfaces';
import { EnumTransactionType } from '../interfaces/enums';

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
    const soldQuantity = productData.saleEntries ?
                            this.getTotal(productData.saleEntries
                              .filter(d=>d.sale.completedDate !== null)
                              .map(d=>d.quantity)) : 0;
    const returnedQuantity = productData.saleEntries ?
                            this.getTotal(productData.saleEntries.filter(d=> d.returnFlag === true).map(d=>d.quantity)) : 0;
    return soldQuantity - returnedQuantity;
  }

  getProductToBeSold(productData: IProductData): number {
    return productData.saleEntries ?
            this.getTotal(productData.saleEntries
                                        .filter(d=>d.sale.completedDate === null &&
                                                d.sale.cancelledDate === null &&
                                                d.sale.dispatchDate !== null).map(d=>d.quantity)) : 0;
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

  getMaterialConsumed(materialData: IMaterialData): number {
    return materialData.productionEntries ?
            this.getTotal(materialData.productionEntries
                .filter(d=>d.production.completedDate !== null && d.production.cancelledDate === null)
                .map(d=>d.materialQuantity)) : 0;
  }

  getMaterialToBeConsumed(materialData: IMaterialData): number {
    return  materialData.productionEntries ?
              this.getTotal(materialData.productionEntries
                  .filter(d=>d.production.productionDate !== null
                    && d.production.completedDate === null
                    && d.production.cancelledDate === null)
                  .map(d=>d.materialQuantity)) : 0;
  }

  getMaterialStock(materialData: IMaterialData): number {
    const purchased = materialData.purchaseEntries ?
                      this.getTotal(materialData.purchaseEntries
                      .filter(d=>d.purchase.completedDate !== null).filter(d=>d.returnFlag === false).map(d=>d.quantity)) : 0;
    const returned = materialData.purchaseEntries ?
                      this.getTotal(materialData.purchaseEntries
                        .filter(d=>d.returnFlag === true).map(d=>d.quantity)) : 0;
    const consumed = this.getMaterialConsumed(materialData);

    return purchased -returned - consumed;
  }

  getMaterialToBeInStock(materialData: IMaterialData): number {
    return materialData.purchaseEntries ?
                      this.getTotal(materialData.purchaseEntries
                      .filter(d=>d.purchase.completedDate === null &&
                        d.purchase.cancelledDate === null &&
                        d.purchase.dispatchDate !== null)
                      .filter(d=>d.returnFlag === false).map(d=>d.quantity)) : 0;

  }

  getLastSuppliedBy(materialData: IMaterialData): string {
    if (materialData.purchaseEntries.length <= 1) {
      return materialData.purchaseEntries[0]?.purchase.supplier.clientName;
    }

    const supplierAndDate = [];
    materialData.purchaseEntries.filter(d=>d.purchase.completedDate !== null).forEach(d=>{
      supplierAndDate.push(
        {
          purchaseCompleteDate: new Date(d.purchase.completedDate).getTime(),
          supplierName: d.purchase.supplier.clientName
        }
      );
    });
    supplierAndDate.sort((a, b)=> b.purchaseCompleteDate - a.purchaseCompleteDate);

    return supplierAndDate[0].supplierName;

  }
}
