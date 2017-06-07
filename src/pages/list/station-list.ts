import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, LoadingController } from 'ionic-angular';
import { Stations } from '../../providers/stations';

@IonicPage({
  name: 'station-list'
})
@Component({
  selector: 'page-station-list',
  templateUrl: 'station-list.html'
})
export class StationList {
  stations: Array<any>;
  icon: string = 'assets/icon/baaqmd_icon.png';

  constructor(public nav: NavController, public navParams: NavParams, public stationData: Stations, public loadingCtrl: LoadingController) {
    this.stations = [];
  }

  ionViewDidLoad() {
    console.log('Hello StationList Page');

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.stationData.stations.forEach(station => {
      this.stations.push(station);
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
  gotoStation($event, station) {
    var t: Tabs = this.nav.parent;
    this.stationData.selectedStation = station;
    t.select(0);
  }
}
