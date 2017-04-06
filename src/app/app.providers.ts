import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { ProfileData } from '../providers/profile-data';

// Import Plugin providers.
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

class CameraMock extends Camera {
  getPicture(options){
    return new Promise( (resolve, reject) => {
      resolve("TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZXJzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmRlZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRoZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=");
    });
  }
}
 
export class AppProviders {
  public static getProviders() {
    let providers;
    if(document.URL.includes('https://') || document.URL.includes('http://')){
      // Use browser providers
        providers = [
          {provide: Camera, useClass: CameraMock},
          {provide: ErrorHandler, useClass: IonicErrorHandler},
          AuthData,
          EventData,
          ProfileData,
          SplashScreen,
          StatusBar
      ];
    } else {
      // Use device providers
      providers = [
        Camera,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AuthData,
        EventData,
        ProfileData,
        SplashScreen,
        StatusBar
      ];  
    }
    return providers;
    }
}