import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { ProfileData } from '../providers/profile-data';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

class CameraMock extends Camera {
  getPicture(options){
    return new Promise( (resolve, reject) => {
      resolve("ADD_BASE64_STRING_RESPONSE_HERE");
    });
  }
}
 
export function GetProviders() {
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