import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogDetailPage } from './log-detail';

@NgModule({
  declarations: [
    LogDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LogDetailPage),
  ],
  exports: [
    LogDetailPage
  ]
})
export class LogDetailPageModule {}
