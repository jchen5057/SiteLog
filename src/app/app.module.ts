import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AuthDataProvider } from '../providers/auth-data/auth-data';
import { EventDataProvider } from '../providers/event-data/event-data';
import { ProfileDataProvider } from '../providers/profile-data/profile-data';

class CameraMock extends Camera {
  getPicture(options){
    return new Promise( (resolve, reject) => {
      resolve("ADD_BASE64_STRING_RESPONSE_HERE");
    });
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: Camera, useClass: CameraMock},
    {provide: ErrorHandler, useClass: IonicErrorHandler}, AuthDataProvider, EventDataProvider, ProfileDataProvider
  ]
})
export class AppModule {}
