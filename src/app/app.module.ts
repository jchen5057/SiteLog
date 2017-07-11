import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Network } from '@ionic-native/network';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

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
import { OrderBy } from '../pipes/orderby';

import { Stations } from '../providers/stations';
import { Instruments } from '../providers/instruments';
import { GoogleMaps } from '../providers/google-maps';
import { Connectivity } from '../providers/connectivity-service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LocationTracker } from '../providers/location-tracker/location-tracker';
import { UserLocationProvider } from '../providers/user-location/user-location';

//import * as firebase from 'firebase';

export const firebaseConfig = {
  apiKey: "AIzaSyDPVX6GkNkbYjgGyMoGlaBaxRAQ09_EuFk",
  authDomain: "sitelog-17255.firebaseapp.com",
  databaseURL: "https://sitelog-17255.firebaseio.com",
  projectId: "sitelog-17255",
  storageBucket: "sitelog-17255.appspot.com",
  messagingSenderId: "172022077560"
};
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'a7e57de1'
  }
};
@NgModule({
  declarations: [
    MyApp,
    HomeTabs,
    MapPage,
    OrderBy
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
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
    BackgroundGeolocation,
    Network,
    Stations, Instruments, GoogleMaps, Connectivity,
    File, Transfer, Camera, FilePath,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthService,
    LogProvider,
    ProfileProvider,
    LocationTracker,
    UserLocationProvider,
  ]
})
export class AppModule { }
