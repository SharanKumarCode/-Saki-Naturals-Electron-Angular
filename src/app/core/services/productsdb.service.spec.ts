import { TestBed } from '@angular/core/testing';

import { ProductsdbService } from './productsdb.service';

describe('ProductsdbService', () => {
  let service: ProductsdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
