import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';
import { ipcRenderer } from 'electron';
import { ProductsService } from './products.service';
import { IProductData, IProductGroup } from '../../interfaces/interfaces';
import { NotificationService } from '../notification/notification.service';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsdbService {

  ipcRenderer: typeof ipcRenderer;

  constructor(
    private electronService: ElectronService,
    private productService: ProductsService,
    private commonService: CommonService,
    private notificationService: NotificationService
    ) {
      this.ipcRenderer = this.electronService.getIpcRenderer();
  }

  getProducts(): void{
    const productsList: IProductData[]  = [];
    this.ipcRenderer.invoke('get-products').then(data=>{
      console.log('INFO : Received all products');
      data.forEach(element => {
        if (element.deleteFlag === false){

          const productData: IProductData = {
            productID: element.productID,
            productName: element.productName,
            production: element.production,
            saleEntries: element.saleEntries,
            productGroupID: element.productGroup.productGroupID,
            productGroupName: element.productGroup.productGroupName,
            description: element.description,
            priceDirectSale: element.priceDirectSale,
            priceReseller: element.priceReseller,
            priceDealer: element.priceDealer,
            createdDate: element.createdDate,
            remarks: element.remarks,
            productGroup: element.productGroup
          };
          productData.stock = this.commonService.getProductStock(productData);
          productData.sold = this.commonService.getProductSold(productData);
          productData.inProduction = this.commonService.getProductInProduction(productData);
          productData.toBeSold = this.commonService.getProductToBeSold(productData);

          productsList.push(productData);
        }
      });
      this.productService.updateProductList(productsList);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to fetch products data from DB');

    });
  }

  getProductByID(productID: string): Promise<any>{
    return this.ipcRenderer.invoke('get-product-by-id', productID)
    .then(data=>{
      const productData = data[0];
      productData.stock = this.commonService.getProductStock(productData);
      productData.sold = this.commonService.getProductSold(productData);
      productData.inProduction = this.commonService.getProductInProduction(productData);
      productData.toBeSold = this.commonService.getProductToBeSold(productData);
      this.productService.updateSelectedProductData(productData);

      return new Promise((res, rej)=>{
        res(true);
      });
    })
    .catch(err=>{
      console.error(err);

      return new Promise((res, rej)=>{
        rej(true);
      });
    });
  }

  insertProduct(product: IProductData): void{
    this.ipcRenderer.invoke('insert-product', product)
    .then(_=>{
      console.log('INFO : added new product');
      this.getProducts();
      this.notificationService.updateSnackBarMessageSubject('Inserted product data to DB');
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to insert product data to DB');

    });
  }

  updateProduct(product: IProductData): void{
    console.log(product);
    this.ipcRenderer.invoke('update-product', product)
    .then(_=>{
      console.log('INFO : updated product');
      this.notificationService.updateSnackBarMessageSubject('Updated product data to DB');

    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to update product data to DB');
    });
  }

  deleteProduct(productID: string) {
    return this.ipcRenderer.invoke('soft-delete-product', productID);

  }

  getAllProductGroups(): void {

    let productGroupList: IProductGroup[];
    this.ipcRenderer.invoke('get-product-groups')
    .then(data=>{
      console.log('INFO : Fetched all product Groups');
      productGroupList = data.filter(d=>d.deleteFlag === false).map(d=>({
          productGroupID: d.productGroupID,
          productGroupName: d.productGroupName
        }));
      this.productService.updateProductGroupList(productGroupList);
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to fetch product groups from DB');
    });
  }

  insertProductGroup(productGroupData: IProductGroup): void {
    this.ipcRenderer.invoke('insert-product-group', productGroupData)
    .then(_=>{
      console.log('INFO : Inserted product group');
      this.getAllProductGroups();
      this.notificationService.updateSnackBarMessageSubject('Inserted product group to DB');
    })
    .catch(err=>{
      console.log(err);
      this.notificationService.updateSnackBarMessageSubject('Unable to insert product group to DB');
    });
  }

  deleteProductGroup(productGroupID: string): void {
    this.getProductByProductGroupID(productGroupID).then(productData=>{
      let DELETE_TYPE = 'hard-delete-product-group';

      if (productData.length > 0){
        DELETE_TYPE = 'soft-delete-product-group';
      }

      this.ipcRenderer.invoke(DELETE_TYPE, productGroupID)
        .then(_=>{
          console.log('INFO : Deleted product group by ID');
          this.getAllProductGroups();
          this.notificationService.updateSnackBarMessageSubject('Deleted product group from DB');

        })
        .catch(err=>{
          console.log(err);
          this.notificationService.updateSnackBarMessageSubject('Unable to delete product group from DB');

        });
    });

  }


  getProductByProductGroupID(productGroupID: string) {
    return this.ipcRenderer.invoke('get-product-by-group-id', productGroupID);
  }


}
