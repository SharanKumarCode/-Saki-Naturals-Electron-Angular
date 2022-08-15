import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductsDialogComponent } from './add-products-dialog.component';

describe('AddProductsDialogComponent', () => {
  let component: AddProductsDialogComponent;
  let fixture: ComponentFixture<AddProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
