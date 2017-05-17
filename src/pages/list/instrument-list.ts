import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-instrument-list',
  templateUrl: 'instrument-list.html',
})
export class InstrumentList {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InstrumentList');
  }
  gotoStation(station: string) {

  }
}
