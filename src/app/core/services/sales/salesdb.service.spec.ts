import { TestBed } from '@angular/core/testing';

import { SalesdbService } from './salesdb.service';

describe('SalesdbService', () => {
  let service: SalesdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
