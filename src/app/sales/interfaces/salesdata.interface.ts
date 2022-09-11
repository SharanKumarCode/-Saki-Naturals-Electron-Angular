export interface ISalesData {
    salesID?: string;
    productID: string;
    productName?: string;
    currentStock?: number;
    group?: string;
    saleDate: string;
    saleTime?: string;
    purchaser: string;
    supplier: string;
    saleType: EnumSaleType;
    sellingPrice: number;
    sellingQuantity: number;
    remarks?: string;
    transactionHistory?: ISaleTransactions[];
    editCreate?: string;
}

export interface ISaleTransactions {
    transactionID?: string;
    salesID?: string;
    transactionDate: string;
    transactionType?: string;
    paid: number;
    balance?: number;
    remarks?: string;
    editCreate?: string;
}

export interface ISaleTransactionComplete {
    saleData: ISalesData;
    transactionData: ISaleTransactions;
}

export enum EnumSaleType {
    directSale = 'Direct_Sale',
    reseller = 'Reseller',
    dealer = 'Dealer'
}
