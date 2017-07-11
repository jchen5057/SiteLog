import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';

import { MapPage } from '../map/map';

@Component({
    selector: 'page-home',
    templateUrl: 'home-tabs.html'
})
export class HomeTabs {
    tab1Root: any = MapPage;
    tab2Root: any = 'station-list';
    tab3Root: any = 'instrument-list';
    tab4Root: any = 'about';

    constructor(public nav: NavController, public locationTracker: LocationTracker) {
        console.log('hometabs');
    }
    ionViewDidEnter() {
        this.start();
    }

    ionViewDidLeave() {
        this.stop();
    }

    start() {
        this.locationTracker.startTracking();
    }

    stop() {
        this.locationTracker.stopTracking();
    }
}
