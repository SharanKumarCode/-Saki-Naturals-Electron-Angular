export interface IProductData {
    productID?: string;
    productName: string;
    productGroup?: IProductGroup;
    productGroupID?: string;
    productGroupName?: string;
    saleEntries?: ISaleEntry[];
    production?: IProductionData[];
    description: string;
    stock?: number;
    sold?: number;
    inProduction?: number;
    toBeSold?: number;
    priceDirectSale?: number;
    priceReseller?: number;
    priceDealer?: number;
    createdDate?: Date;
    remarks?: string;
    editCreate?: string;
  }

  export interface IMaterialData {
    materialID?: string;
    materialName: string;
    description: string;
    productionEntries?: IProductionEntry[];
    purchaseEntries?: IPurchaseEntry[];
    stock?: number;
    toBeInStock?: number;
    createdDate?: Date;
    consumed?: number;
    toBeConsumed?: number;
    remarks?: string;
    editCreate?: string;
  }

  export interface IProductGroup {
    productGroupID?: string;
    productGroupName: string;
  }

  export interface ISalesData {
    salesID?: string;
    saleType: EnumSaleType;
    customer?: IClientData;
    saleEntries?: ISaleEntry[];
    saleTransactions?: ISaleTransactions[];
    salesDate: Date;

    gstPercentage: number;
    overallDiscountPercentage: number;
    transportCharges: number;
    miscCharges: number;
    paymentTerms: number;

    currentStock?: number;
    sellingPrice?: number;
    sellingQuantity?: number;
    paid?: number;
    totalAmount?: number;
    balance?: number;
    remarks?: string;
    editCreate?: string;
    serialNumber?: number;

    dispatchDate?: Date;
    deliveredDate?: Date;
    returnedDate?: Date;
    refundedDate?: Date;
    completedDate?: Date;
    cancelledDate?: Date;
}

export interface ISaleEntry {
  saleEntryID?: string;
  salesID?: string;
  sale?: ISalesData;
  product: IProductData;
  returnFlag?: boolean;
  price?: number;
  quantity?: number;
  discountPercentage?: number;
}

export interface ISaleTransactions {
    transactionID?: string;
    sales?: ISalesData;
    salesID?: string;
    transactionDate: Date;
    transactionType?: EnumTransactionType;
    transactionAmount: number;
    balance?: number;
    remarks?: string;
    editCreate?: string;
}

export interface IPurchaseData {
  purchaseID?: string;
  supplier?: IClientData;
  purchaseEntries?: IPurchaseEntry[];
  purchaseTransactions?: IPurchaseTransactions[];
  purchaseDate: Date;

  gstPercentage: number;
  overallDiscountPercentage: number;
  transportCharges: number;
  miscCharges: number;
  paymentTerms: number;

  currentStock?: number;
  purchasePrice?: number;
  purchaseQuantity?: number;
  paidAmount?: number;
  totalPrice?: number;
  balance?: number;
  remarks?: string;
  editCreate?: string;
  serialNumber?: number;

  dispatchDate?: Date;
  deliveredDate?: Date;
  returnedDate?: Date;
  refundedDate?: Date;
  completedDate?: Date;
  cancelledDate?: Date;
}

export interface IPurchaseEntry {
  purchaseEntryID?: string;
  purchaseID?: string;
  purchase?: IPurchaseData;
  material: IMaterialData;
  returnFlag?: boolean;
  price?: number;
  quantity?: number;
  discountPercentage?: number;
}

export interface IPurchaseTransactions {
  transactionID?: string;
  purchase?: IPurchaseData;
  purchaseID?: string;
  transactionDate: Date;
  transactionType?: EnumTransactionType;
  transactionAmount: number;
  balance?: number;
  remarks?: string;
  editCreate?: string;
}

export interface IProductionData {
  productionID?: string;
  productionEntries?: IProductionEntry[];
  productionDate: Date;
  product?: IProductData;
  productQuantity?: number;

  remarks?: string;
  editCreate?: string;
  serialNumber?: number;

  completedDate?: Date;
  cancelledDate?: Date;
}

export interface IProductionEntry {
  productionEntryID?: string;
  productionID?: string;
  production?: IProductionData;
  material: IMaterialData;
  materialQuantity?: number;
}

export interface IClientData {
  clientID?: string;
  clientName: string;
  contactPerson: string;
  clientType: EnumClientType;
  description: string;
  contact1: string;
  contact2?: string;
  landline?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  email?: string;
  remarks?: string;
  editCreate?: string;
  deleteFlag?: boolean;
  createdDate: Date;
}

export enum EnumClientType {
  customer = 'CUSTOMER',
  supplier = 'SUPPLIER'
}

export enum EnumSaleType {
  directSale = 'Direct Sale',
  reseller = 'Reseller',
  dealer = 'Dealer'
}

export enum EnumTransactionType {
advance = 'Advance',
paid = 'Paid',
refund = 'Refund'
}

export enum EnumSalaryFrequency {
monthly = 'Monthly',
weekly = 'Weekly',
others = 'Others'
}

export enum EnumRouteActions {
  update = 'Update',
  create = 'Create'
}

export enum EnumSaleStatus {
  initiated = 'Initiated',
  dispatched = 'Dispatched',
  delivered = 'Delivered',
  returned = 'Returned',
  refunded = 'Refunded',
  completed = 'Completed',
  cancelled = 'Cancelled'
}

export enum EnumPurchaseStatus {
  initiated = 'Initiated',
  dispatched = 'Dispatched',
  delivered = 'Delivered',
  returned = 'Returned',
  refunded = 'Refunded',
  completed = 'Completed',
  cancelled = 'Cancelled'
}

export enum EnumProductionStatus {
  initiated = 'Initiated',
  completed = 'Completed',
  cancelled = 'Cancelled'
}
