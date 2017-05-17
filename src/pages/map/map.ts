/// <reference path="../../../typings/globals/google.maps/index.d.ts" />
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Stations } from '../../providers/stations';
import { Instruments } from '../../providers/instruments';
import { GoogleMaps } from '../../providers/google-maps';
import { NavController, Platform, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import 'rxjs/add/operator/debounceTime';

//@IonicPage({//name: 'map'})
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  stations: any = [];
  instruments: any = [];
  markers: any = [];
  instrument_classes: any;
  selected_class: string;

  searchStation: string = '';
  searchControl: FormControl;
  selectedStation: string;
  selectedInstruments: Array<any> = [];
  searching: any = false;

  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;

  constructor(public auth: AuthService, public nav: NavController, public zone: NgZone, public maps: GoogleMaps, public platform: Platform, public viewCtrl: ViewController,
    public stationData: Stations, public instrumentData: Instruments) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Map');

    this.platform.ready().then(() => {
      console.log("platform ready...")
      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
      let stationsLoaded = this.stationData.load();
      let instrumentsLoaded = this.instrumentData.load();

      Promise.all([
        mapLoaded,
        stationsLoaded,
        instrumentsLoaded
      ]).then((result) => {
        this.stations = result[1];
        this.instruments = result[2];

        let _classes = this.instruments.map(data => data.Class);
        this.instrument_classes = Array.from(new Set(_classes));

        this.mapStations(this.stations);

        //console.log(this.classes);
      });
    });

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      if (this.searching) this.setFilteredStations();
      this.searching = false;
    });
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter Map');
    let _station = this.stationData.selectedStation;
    if (_station) this.gotoStation(_station);
  }
  logout() {
    this.auth.logoutUser();
    this.nav.setRoot('login');
  }
  onSearchInput() {
    this.searching = true;
  }

  setFilteredStations() {
    //console.log('filter:', this.searchStation);
    this.selected_class = '';
    let _stations = this.filterStations(this.searchStation);
    this.mapStations(_stations);
  }

  filterStations(searchStation) {
    return this.stations.filter((station) => {
      return station.Name.toLowerCase().indexOf(searchStation.toLowerCase()) > -1;
    });
  }

  selectClass($event) {
    this.selectedStation = '';
    this.searchStation = '';
    let _instruments = this.instruments.filter((instrument) => {
      return instrument.Class == $event;
      //}).map(data => data.FullAQSCode);
    }).map(data => data.SiteName);

    let _stations = this.stations.filter((station) => {
      //return _instruments.indexOf(station.FullAQSCode) > 0;
      return _instruments.indexOf(station.Name) > 0;
    });

    this.mapStations(_stations);
  }

  mapStations(stationData) {
    this.maps.removeMarkers();
    for (let station of stationData) {
      this.maps.addMarker(this, station.Name, station.Latitude, station.Longitude);
    }
  }

  gotoStation(name: string) {
    this.selectedStation = name;

    this.selectedInstruments = this.instruments.filter((instrument) => {
      return instrument.SiteName == name;
    });
    this.searchStation = name;
    this.setFilteredStations();
  }

  gotoLog(name: string) {
    console.log('Load Log:', name);
  }

  save() {
    this.viewCtrl.dismiss(this.location);
  }

  close() {
    this.viewCtrl.dismiss();
  }
  swipeEvent($event) {
    this.selectedStation = '';
    this.selectedInstruments = [];
  }
  tapEvent(instrument) {
    console.log('tap', instrument);
    this.nav.push('log-detail', { instrument: instrument });
  }
}