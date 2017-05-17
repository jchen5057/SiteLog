import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LogProvider } from '../../providers/log';

@IonicPage({
  name: 'log-list'
})
@Component({
  selector: 'page-log-list',
  templateUrl: 'log-list.html',
})
export class LogListPage {
  public logList: Array<any>;

  constructor(public navCtrl: NavController, public logProvider: LogProvider) { }

  ionViewDidEnter() {
    this.logProvider.getLogList().then(logListSnap => {
      this.logList = logListSnap;
    });
  }

  goToLogDetail(logId) {
    this.navCtrl.push('log-detail', { 'logId': logId });
  }

}