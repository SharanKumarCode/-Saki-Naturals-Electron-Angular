import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTransactionComponent } from './sales-transaction.component';

describe('SalesTransactionComponent', () => {
  let component: SalesTransactionComponent;
  let fixture: ComponentFixture<SalesTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
