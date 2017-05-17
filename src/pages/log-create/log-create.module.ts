import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogCreatePage } from './log-create';

@NgModule({
  declarations: [
    LogCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(LogCreatePage),
  ],
  exports: [
    LogCreatePage
  ]
})
export class LogCreatePageModule {}
