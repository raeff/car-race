import { NgModule } from '@angular/core';
import {
  DxButtonModule,
  DxFormModule,
  DxScrollViewModule,
  DxTextBoxModule,
  DxToastModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { SharedModule } from '../shared/shared.module';
import { EventVerifierComponent } from './event-verifier.component';
import { SplashScreenComponent } from './../splash-screen/splash-screen.component';
import { IdeenherdLibraryModule } from '@ideenherd';
@NgModule({
  declarations: [EventVerifierComponent, SplashScreenComponent],
  imports: [
    SharedModule,
    DxToolbarModule,
    DxFormModule,
    DxButtonModule,
    DxTextBoxModule,
    DxScrollViewModule,
    IdeenherdLibraryModule,
    DxToastModule,
  ],
  providers: [],
  bootstrap: [],
  exports: [EventVerifierComponent],
})
export class EventVerifierModule { }
