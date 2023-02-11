import { EnumSaleType, EnumTransactionType, EnumClientType, EnumGender, EnumSalaryFrequency, EnumAttendanceValues } from './enums';

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

export interface IEmployeeData {
  employeeAttendanceEntries?: IAttendanceEntry[];
  employeeSalaryEntries?: ISalaryTransaction[];
  employeeID?: string;
  employeeName: string;
  role: string;
  dob: Date;
  aadhar: string;
  gender: EnumGender;
  salary: number;
  salaryFrequency: EnumSalaryFrequency;
  contact1: string;
  contact2?: string;
  address?: string;
  email?: string;
  joiningDate: Date;
  exitDate?: Date;
  remarks?: string;

  editCreate?: string;
  deleteFlag?: boolean;
  createdDate?: Date;
}

export interface IAttendanceEntry {
  attendanceEntryID?: string;
  employee: IEmployeeData;
  date: Date;
  status: EnumAttendanceValues;
  remarks?: string;
}

export interface ISalaryTransaction {
  salaryTransactionID?: string;
  employee: IEmployeeData;
  transactionType: string;
  amount: number;
  transactionDate: Date;
  remarks: string;
}

export interface ICompanyData {
  companyID?: string;
  companyName: string;
  proprietor: string;
  contact1: string;
  contact2?: string;
  landline?: string;
  addressLine1: string;
  addressLine2?: string;
  gstNumber: string;
  msmeNumber: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  email?: string;
  remarks?: string;
  theme?: string;
  lastBackup?: Date;
  editCreate?: string;
  deleteFlag?: boolean;
  createdDate?: Date;
}

