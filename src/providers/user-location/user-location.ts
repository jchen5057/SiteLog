import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { GoogleMaps } from '../../providers/google-maps';

import 'rxjs/add/operator/map';

import { AuthService } from '../auth-service';

@Injectable()
export class UserLocationProvider {

  constructor(public auth: AuthService, public db: AngularFireDatabase, public maps: GoogleMaps) {
    console.log('Hello UserLocationProvider Provider');
  }

  updatePosition(position) {
    if (this.auth.currentUser) {
      //this.db.list(`/userPosition/${this.auth.currentUser.uid}`).push({
      this.db.object(`/userPosition/${this.auth.currentUser.uid}`).set({
        icon: this.auth.currentUser.photoURL,
        Name: this.auth.currentUser.displayName,
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        timestamp: position.timestamp
      })
        .then(_ => {
          this.getLocations();
          console.log('update position: success', position);
        })
        .catch(err => console.log(err, 'update position: You do not have access!'));
    }
    console.log('update position', this.auth.currentUser.uid, position);
  }

  getLocations() {
    /*const location$ = this.db.list('/userPosition', {
      query: {
        orderByChild: 'user',
        equalTo: 'large'
      }
    }*/
    const position$ = this.db.list('/userPosition').subscribe(positions => {
      console.log('positions', positions);
      this.plotPositions(positions);
      position$.unsubscribe();
    });
  }
  plotPositions(positions) {
    positions.forEach(p => {
      this.maps.addMarker(null, p, p.lat, p.lon);
    });
  }
}
