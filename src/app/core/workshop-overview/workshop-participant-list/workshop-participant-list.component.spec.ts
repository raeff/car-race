import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopParticipantListComponent } from './workshop-participant-list.component';

describe('WorkshopParticipantListComponent', () => {
  let component: WorkshopParticipantListComponent;
  let fixture: ComponentFixture<WorkshopParticipantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopParticipantListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopParticipantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
