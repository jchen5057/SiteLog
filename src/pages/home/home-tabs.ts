import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';

@Component({
    selector: 'page-home',
    templateUrl: 'home-tabs.html'
})
export class HomeTabs {
    tab1Root: any = MapPage;
    tab2Root: any = 'StationList';
    tab3Root: any = 'log-list';

    constructor(public nav: NavController) {

    }
    ionViewDidEnter() {

    }
    goToProfile() { this.nav.push('profile'); }

    goToCreate() { this.nav.push('event-create'); }

    goToList() { this.nav.push('event-list'); }
    
}
