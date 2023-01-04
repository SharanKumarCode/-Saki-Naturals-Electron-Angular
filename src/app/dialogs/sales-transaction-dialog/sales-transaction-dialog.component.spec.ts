import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTransactionDialogComponent } from './sales-transaction-dialog.component';

describe('SalesTransactionDialogComponent', () => {
  let component: SalesTransactionDialogComponent;
  let fixture: ComponentFixture<SalesTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTransactionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
