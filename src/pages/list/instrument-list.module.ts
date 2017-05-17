import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstrumentList } from './instrument-list';

@NgModule({
  declarations: [
    InstrumentList,
  ],
  imports: [
    IonicPageModule.forChild(InstrumentList),
  ],
  exports: [
    InstrumentList
  ]
})
export class InstrumentListModule {}
