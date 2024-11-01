import { NgModule } from '@angular/core';
import { IdeenherdLibraryModule, QrScannerComponent } from '@ideenherd';
import {
  DxButtonModule,
  DxScrollViewModule,
  DxToastModule,
} from 'devextreme-angular';
import { SharedModule } from '../shared/shared.module';
import { EventScannerComponent } from './event-scanner.component';

@NgModule({
  declarations: [EventScannerComponent],
  imports: [
    SharedModule,
    DxToastModule,
    DxButtonModule,
    DxScrollViewModule,
    IdeenherdLibraryModule,
  ],
  providers: [],
  bootstrap: [],
  exports: [EventScannerComponent],
})
export class EventScannerModule {}
