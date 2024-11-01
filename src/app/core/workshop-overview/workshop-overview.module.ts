import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { WorkshopOverviewComponent } from './workshop-overview.component';
import { DxButtonModule, DxListModule, DxRadioGroupModule, DxScrollViewModule } from 'devextreme-angular';
import { WorkshopParticipantComponent } from './workshop-participant/workshop-participant.component';
import { WorkshopParticipantListComponent } from './workshop-participant-list/workshop-participant-list.component';
import { IdeenherdLibraryModule } from '@ideenherd';
@NgModule({
  declarations: [WorkshopOverviewComponent, WorkshopParticipantComponent, WorkshopParticipantListComponent],
  imports: [
    SharedModule,
    FlexLayoutModule,
    DxListModule,
    DxRadioGroupModule,
    IdeenherdLibraryModule,
    DxButtonModule,
    DxScrollViewModule
  ],
  providers: [],
  bootstrap: [],
  exports: [WorkshopOverviewComponent],
})
export class WorkshopOverviewModule { }
