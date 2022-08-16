import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDialogComponent } from './sales-dialog.component';

describe('SalesDialogComponent', () => {
  let component: SalesDialogComponent;
  let fixture: ComponentFixture<SalesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
