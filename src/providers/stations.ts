import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';

@Injectable()
export class Stations {
  stations: any;
  selectedStation: any;

  constructor(public http: Http, public db: AngularFireDatabase) {
    console.log('Hello Stations Provider');
    //this.upload2firebase();
    //this.load();
  }

  load() {
    if (this.stations) {
      return Promise.resolve(this.stations);
    }

    return new Promise(resolve => {
      this.db.list('/stations', {
        query: {
          orderByChild: 'StationID'
        }
      }).subscribe(stations => {
        this.stations = stations;
        resolve(this.stations);
      });
    });
  }

  upload2firebase() {
    this.http.get('assets/data/stations.json').map(res => res.json()).subscribe(data => {
      data.stations.forEach(station => {
        let _aqid = station.FullAQSCode.replace('.', '%2E');
        _aqid = _aqid.replace('/', '%2F');
        this.db.object(`/stations/${_aqid}`).set(station);
      });
    });
  }

  applyHaversine(locations) {
    let usersLocation = {
      lat: 40.713744,
      lng: -74.009056
    };

    locations.map((location) => {
      let placeLocation = {
        lat: location.latitude,
        lng: location.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'miles'
      ).toFixed(2);
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;
  }

  toRad(x) {
    return x * Math.PI / 180;
  }
}