import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, LoadingController } from 'ionic-angular';
import { Instruments } from '../../providers/instruments';
//import { OrderBy } from '../../pipes/orderby';

@IonicPage({
  name: 'instrument-list'
})
@Component({
  selector: 'page-instrument-list',
  templateUrl: 'instrument-list.html',
  //pipes:[OrderBy],
})
export class InstrumentList {
  instruments: Array<any>;
  sortBy: Array<any> = ['Name', 'Class', 'Manufacturer', 'PuchaseDate', 'SiteName'];
  sortby: string = 'Name';
  //icon: string = 'assets/icon/baaqmd_icon.png';

  constructor(public nav: NavController, public navParams: NavParams, public instrumentData: Instruments, public loadingCtrl: LoadingController) {
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
  getStationIcon(stationName: string): string {
    if (stationName.startsWith('m_')) {
      return 'https://maps.google.com/mapfiles/kml/pal4/icon30.png';
    } else {
      return 'assets/icon/baaqmd_icon.png';
    }
  }
  gotoInstrument($event, instrument) {
    var t: Tabs = this.nav.parent;
    this.instrumentData.selectedInstrument = instrument;
    //this.stationData.selectedStation = station;
    t.select(0);
  }
}
