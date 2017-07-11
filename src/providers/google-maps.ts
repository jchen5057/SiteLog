/// <reference path="../../typings/globals/google.maps/index.d.ts" />

import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
//import { Platform } from 'ionic-angular';
import { Connectivity } from './connectivity-service';

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

  addMarker(page: any, position: any, lat: number, lng: number): void {
    //yconsole.log('add markers', position);
    let latLng = new google.maps.LatLng(lat, lng);

    let icon: any;
    let color: string;
    let id: string;

    if (page) {
      if (position.Name.startsWith('m_')) {
        icon = 'https://maps.google.com/mapfiles/kml/pal4/icon30.png';
        color = 'green';
        id = position.Name.substr(2, 1).toLowerCase();
      } else {
        //let icon = 'https://maps.google.com/mapfiles/kml/paddle/A.png';
        icon = 'assets/icon/baaqmd_icon.png';
        color = 'red';
        id = position.Name.substr(0, 1);
      }
    } else {
      //icon = position.icon;
      icon = {
        url: position.icon, // url
        scaledSize: new google.maps.Size(30, 30), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };

      id = position.Name.substr(0, 1);
      color = 'blue';
    }

    let marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      icon: icon,
      title: position.Name,
      animation: google.maps.Animation.DROP,
      clickable: true,
      label: { text: id, color: color },
    });
    this.addInfoWindow(page, marker, position);
    this.markers.push(marker);
  }

  addInfoWindow(page, marker, position) {
    google.maps.event.addListener(marker, 'click', () => {
      if (page) {
        page.gotoStation(position);
      } else {
        let content = `<a href="#">${position.Name}</a>`;
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });
        //infoWindow.open(this.map, marker);
      }
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