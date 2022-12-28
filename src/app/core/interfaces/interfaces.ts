export interface IProductData {
    productID?: string;
    productName: string;
    productGroupID: string;
    productGroupName: string;
    description: string;
    stock?: number;
    priceDirectSale?: number;
    priceReseller?: number;
    priceDealer?: number;
    createdDate?: Date;
    sold?: number;
    remarks?: string;
    editCreate?: string;
  }

  export interface IProductGroup {
    productGroupID?: string;
    productGroupName: string;
  }

  export interface ISalesData {
    salesID?: string;
    productID: string;
    productName?: string;
    productGroup?: string;
    productDescription?: string;
    currentStock?: number;
    group?: string;
    saleDate: string;
    saleTime?: string;
    purchaser: string;
    supplier: string;
    saleType: EnumSaleType;
    sellingPrice: number;
    sellingQuantity: number;
    totalAmount?: number;
    paid?: number;
    balance?: number;
    remarks?: string;
    saleTransactions?: ISaleTransactions[];
    editCreate?: string;
    serialNumber?: number;
}

export interface ISaleEntry {
  salesID: string;
  productID: string;
  price?: number;
  quantity?: number;
}

export interface ISaleTransactions {
    transactionID?: string;
    salesID?: string;
    transactionDate: Date;
    transactionType?: EnumTransactionType;
    amount: number;
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

export enum EnumTransactionType {
  credit = 'Credit',
  debit = 'Debit'
}

export enum EnumSalaryFrequency {
  monthly = 'Monthly',
  weekly = 'Weekly',
  others = 'Others'
}

export interface IClientData {
  clientID?: string;
  clientType: EnumClientType;
  clientName: string;
  clientLocation: string;
  clientContact: string;
  remarks?: string;
  createdDate: string;
}

export enum EnumClientType {
  customer = 'Customer',
  supplier = 'Supplier'
}

