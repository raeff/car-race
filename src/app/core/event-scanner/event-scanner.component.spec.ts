import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScannerComponent } from './event-scanner.component';

describe('EventScannerComponent', () => {
  let component: EventScannerComponent;
  let fixture: ComponentFixture<EventScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventScannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
