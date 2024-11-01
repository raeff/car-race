import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopParticipantComponent } from './workshop-participant.component';

describe('WorkshopParticipantComponent', () => {
  let component: WorkshopParticipantComponent;
  let fixture: ComponentFixture<WorkshopParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopParticipantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
