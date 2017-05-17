import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationList } from './station-list';

@NgModule({
  declarations: [
    StationList,
  ],
  imports: [
    IonicPageModule.forChild(StationList),
  ],
  exports: [
    StationList
  ]
})
export class StationListModule {}
