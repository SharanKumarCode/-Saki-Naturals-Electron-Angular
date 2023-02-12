export enum EnumClientType {
    customer = 'CUSTOMER',
    supplier = 'SUPPLIER'
  }

  export enum EnumSaleType {
    directSale = 'Direct Sale',
    reseller = 'Reseller',
    dealer = 'Dealer'
  }

  export enum EnumTransactionDialogType {
    sales = 'Sales',
    purchase = 'Purchase',
    salary = 'Salary'
  }

  export enum EnumTransactionType {
  advance = 'Advance',
  paid = 'Paid',
  refund = 'Refund',
  salary = 'Salary'
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

  export enum EnumGender {
    male = 'Male',
    female = 'Female',
    others = 'Others'
  }

  export enum EnumAttendanceValues {
    none = 'None',
    present = 'Present',
    half = 'Half Day',
    leave = 'Leave',
    cHoliday = 'Company Holiday',
  }

  export enum EnumThemes {
    deeppurpleAmber = 'deeppurple-amber',
    indigoPink = 'indigo-pink',
    pinkBluegrey = 'pink-bluegrey',
    purpleGreen = 'purple-green',
  }

export enum EnumTransactionGroup {
  income = 'Income',
  expense = 'Expense'
}
