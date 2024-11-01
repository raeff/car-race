import { NgModule } from '@angular/core';
import {
  DxButtonModule,
  DxFormModule,
  DxScrollViewModule,
  DxTemplateModule,
  DxTextBoxModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { EventDetailComponent } from './event-detail.component';
import { SharedModule } from '../shared/shared.module';
import { IdeenherdLibraryModule } from '@ideenherd';

@NgModule({
  declarations: [EventDetailComponent],
  imports: [
    SharedModule,
    DxToolbarModule,
    DxFormModule,
    DxButtonModule,
    DxTextBoxModule,
    IdeenherdLibraryModule,
    DxTemplateModule,
    DxScrollViewModule
  ],
  providers: [],
  bootstrap: [],
  exports: [EventDetailComponent],
})
export class EventDetailModule { }
