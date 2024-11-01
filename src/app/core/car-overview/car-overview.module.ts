import { NgModule } from '@angular/core';
import { DxButtonModule, DxListModule, DxScrollViewModule } from 'devextreme-angular';
import { CarOverviewComponent } from './car-overview.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [CarOverviewComponent],
  imports: [SharedModule, FlexLayoutModule, DxButtonModule, DxScrollViewModule, DxListModule],
  providers: [],
  bootstrap: [],
  exports: [CarOverviewComponent],
})
export class CarOverviewModule { }
