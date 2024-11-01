import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventVerifierComponent } from './event-verifier.component';

describe('EventVerifierComponent', () => {
  let component: EventVerifierComponent;
  let fixture: ComponentFixture<EventVerifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventVerifierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
