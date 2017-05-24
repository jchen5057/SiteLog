import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, LoadingController } from 'ionic-angular';
import { Instruments } from '../../providers/instruments';

@IonicPage({
  name: 'instrument-list'
})
@Component({
  selector: 'page-instrument-list',
  templateUrl: 'instrument-list.html',
})
export class InstrumentList {
  instruments: Array<any>;
  icon: string = 'assets/icon/baaqmd_icon.png';

  constructor(public navCtrl: NavController, public navParams: NavParams, public instrumentData: Instruments, public loadingCtrl: LoadingController) {
    this.instruments = [];
    //instrumentData.load();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InstrumentList');
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.instrumentData.instruments.forEach(instrument => {
      this.instruments.push(instrument);
    });
    loading.dismiss();
  }
  gotoInstrument($event, instrument) {

  }
}
