import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LogProvider } from '../../providers/log';

@IonicPage({
  name: 'log-create'
})
@Component({
  selector: 'page-log-create',
  templateUrl: 'log-create.html',
})
export class LogCreatePage {

  constructor(public navCtrl: NavController, public logProvider: LogProvider) { }

  createLog(logName: string, logDate: string, logPrice: number, logCost: number) {
    this.logProvider.createLog(logName, logDate, logPrice, logCost)
      .then(newLog => {
        this.navCtrl.pop();
      });
  }
}