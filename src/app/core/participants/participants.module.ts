import { NgModule } from '@angular/core';
import { DxButtonModule, DxListModule, DxRadioGroupModule, DxScrollViewModule } from 'devextreme-angular';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ParticipantsComponent } from './participants.component';
import { ParticipantComponent } from './participant/participant.component';
import { IdeenherdLibraryModule } from '@ideenherd';
@NgModule({
    declarations: [ParticipantsComponent, ParticipantComponent],
    imports: [SharedModule, FlexLayoutModule, DxButtonModule, DxScrollViewModule, DxListModule, DxRadioGroupModule, IdeenherdLibraryModule],
    providers: [],
    bootstrap: [],
    exports: [ParticipantsComponent],
})
export class ParticipantsModule { }
