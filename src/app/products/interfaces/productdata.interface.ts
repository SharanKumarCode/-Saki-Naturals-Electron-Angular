export interface IProductData {
    productId?: string;
    productName: string;
    group: string;
    description: string;
    stock: number;
    priceDirectSale: number;
    priceReseller: number;
    priceDealer: number;
    createdDate?: string;
    sold: number;
    remarks?: string;
    editCreate?: string;
  }
