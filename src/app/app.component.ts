import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  zone: NgZone;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.zone = new NgZone({});
    firebase.initializeApp({
      apiKey: "AIzaSyBwEUe6x_w_yLFrr--xYLQJLxRT2Rc8vtY",
      authDomain: "ionic-firebase-auth-9f555.firebaseapp.com",
      databaseURL: "https://ionic-firebase-auth-9f555.firebaseio.com",
      storageBucket: "ionic-firebase-auth-9f555.appspot.com",
      messagingSenderId: "904481277327"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run( () => {
        if (!user) {
          this.rootPage = 'login';
          unsubscribe();
        } else { 
          this.rootPage = 'home';
          unsubscribe();
        }
      });     
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

