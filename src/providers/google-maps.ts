/// <reference path="../../typings/globals/google.maps/index.d.ts" />

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Connectivity } from './connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class GoogleMaps {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  markers: any = [];
  apiKey: string = "AIzaSyCljRxokLUKxPSN-BDse2_P2gdjmE7Uhio";

  constructor(public connectivityService: Connectivity, public geolocation: Geolocation) {

  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;

    return this.loadGoogleMaps();
  }

  loadGoogleMaps(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof google == "undefined" || typeof google.maps == "undefined") {

        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        if (this.connectivityService.isOnline()) {
          window['mapInit'] = () => {
            this.initMap().then(() => {
              resolve(true);
            });
            this.enableMap();
          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if (this.apiKey) {
            script.src = 'https://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
          } else {
            script.src = 'https://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);

        }
      } else {
        if (this.connectivityService.isOnline()) {
          this.initMap();
          this.enableMap();
        }
        else {
          this.disableMap();
        }
        resolve(true);
      }
      this.addConnectivityListeners();
    });
  }

  initMap(): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve) => {

      this.geolocation.getCurrentPosition().then((position) => {

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP, //google.maps.MapTypeId.TERRAIN,google.maps.MapTypeId.SATELLITE]
        }

        this.map = new google.maps.Map(this.mapElement, mapOptions);
        resolve(true);

      });

    });

  }

  disableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }

  }

  addConnectivityListeners(): void {

    this.connectivityService.watchOnline().subscribe(() => {

      setTimeout(() => {

        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        }
        else {
          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    });

    this.connectivityService.watchOffline().subscribe(() => {

      this.disableMap();

    });

  }

  addMarker(page: any, name: string, lat: number, lng: number): void {
    console.log('add markers');
    let latLng = new google.maps.LatLng(lat, lng);

    let icon = 'https://maps.google.com/mapfiles/kml/paddle/A.png';
    let color = 'yellow';
    let id: string;
    if (name.startsWith('m_')) {
      icon = 'https://maps.google.com/mapfiles/kml/paddle/M.png';
      id = name.substr(2, 1).toLowerCase();
      color = 'blue';
    } else {
      id = name.substr(0, 1);
    }

    let marker = new google.maps.Marker({
      map: this.map,
      title: name,
      animation: google.maps.Animation.DROP,
      position: latLng,
      clickable: true,
      label: { text: id, color: color },
    });

    this.addInfoWindow(page, marker, name);

    this.markers.push(marker);

  }

  addInfoWindow(page, marker, name) {

    let content = `<a href="#">${name}</a>`;
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      //infoWindow.open(this.map, marker);
      //nav.push('StationPage', { station: name });
      page.gotoStation(name);
    });

  }

  removeMarkers() {
    console.log('remove markers');
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];;
  }
}