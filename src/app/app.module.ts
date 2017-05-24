import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';

import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { HomeTabs } from '../pages/home/home-tabs';
import { MapPage } from '../pages/map/map';

import { AuthService } from '../providers/auth-service';
import { LogProvider } from '../providers/log';
import { ProfileProvider } from '../providers/profile';

import { Stations } from '../providers/stations';
import { Instruments } from '../providers/instruments';
import { GoogleMaps } from '../providers/google-maps';
import { Connectivity } from '../providers/connectivity-service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

//import * as firebase from 'firebase';
/*
class CameraMock extends Camera {
  getPicture(options) {
    return new Promise((resolve, reject) => {
      resolve(`TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1
      bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgY
      SBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb2
      4gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=`);
    });
  }
}*/

export const firebaseConfig = {
  apiKey: "AIzaSyDPVX6GkNkbYjgGyMoGlaBaxRAQ09_EuFk",
  authDomain: "sitelog-17255.firebaseapp.com",
  databaseURL: "https://sitelog-17255.firebaseio.com",
  projectId: "sitelog-17255",
  storageBucket: "sitelog-17255.appspot.com",
  messagingSenderId: "172022077560"
};

@NgModule({
  declarations: [
    MyApp,
    HomeTabs,
    MapPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomeTabs,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Network,
    Stations, Instruments, GoogleMaps, Connectivity,
    File, Transfer, Camera, FilePath,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthService,
    LogProvider,
    ProfileProvider
  ]
})
export class AppModule { }
