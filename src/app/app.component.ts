import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { HomePage } from '../pages/home/home';
import { HomeTabs } from '../pages/home/home-tabs';

import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  zone: NgZone;
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, auth: AngularFireAuth) {
    this.initializeApp();
    //this.zone = new NgZone({}); 
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomeTabs },
      { title: 'Station List', component: 'StationList' },
      { title: 'Instrument List', component: 'InstrumentList' }
    ];

    const authObserver = auth.authState.subscribe((user: firebase.User) => {
      if (user) {
        this.rootPage = HomeTabs;
        authObserver.unsubscribe();
      } else {
        this.rootPage = 'login';
        authObserver.unsubscribe();
      }
    });

    /*
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (!user) {
        } else {
          //this.rootPage = HomePage;
          this.rootPage = HomeTabs;          
          unsubscribe();
        }
      });
    });*/
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //this.nav.setRoot(page.component);
  }
}