import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

    constructor(public nav: NavController) {

    }
    ionViewDidEnter() {

    }
}
