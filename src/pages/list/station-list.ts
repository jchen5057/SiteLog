import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { Stations } from '../../providers/stations';
//import { MapPage } from '../map/map';


@IonicPage()
@Component({
  selector: 'page-station-list',
  templateUrl: 'station-list.html'
})
export class StationList {
  selectedStation: string;
  icons: string[];
  stations: Array<{ title: string, note: string, icon: string }>;
  icon: string = 'assets/icon/baaqmd_icon.png';

  constructor(public nav: NavController, public navParams: NavParams, public stationData: Stations) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedStation = navParams.get('station');

    this.stations = [];

    stationData.stations.forEach(station => {
      this.stations.push({
        title: station.Name,
        note: station.FullAQSCode,
        icon: this.icon
      });
    });
  }

  ionViewDidLoad() {
    console.log('Hello StationList Page');
  }

  gotoStation($event, station) {
    // That's right, we're pushing to ourselves!
    //this.navCtrl.push('StationPage', {
    //  station: station
    //});
    var t: Tabs = this.nav.parent;
    this.stationData.selectedStation = station.title;
    t.select(0);
  }
}
