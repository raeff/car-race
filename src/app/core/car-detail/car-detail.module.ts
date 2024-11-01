import { NgModule } from '@angular/core';
import {
  DxButtonModule,
  DxFormModule,
  DxScrollViewModule,
  DxTextBoxModule,
  DxToastModule,
} from 'devextreme-angular';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { SharedModule } from '../shared/shared.module';
import { CarDetailComponent } from './car-detail.component';

@NgModule({
  declarations: [CarDetailComponent],
  imports: [
    DxToastModule,
    SharedModule,
    DxFormModule,
    DxButtonModule,
    DxTextBoxModule,
    DxiItemModule,
    DxScrollViewModule,
  ],
  providers: [],
  bootstrap: [],
  exports: [CarDetailComponent],
})
export class CarDetailModule { }
