import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogProvider } from '../../providers/log';
import { Camera } from '@ionic-native/camera';

@IonicPage({
  name: 'log-detail',
  segment: 'log-detail/:logId'
})
@Component({
  selector: 'page-log-detail',
  templateUrl: 'log-detail.html',
})
export class LogDetailPage {
  public intrument: any;
  public currentLog: any;
  public guestName: string = '';
  public guestPicture: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public logProvider: LogProvider, public cameraPlugin: Camera) {
    this.intrument = navParams.get('instrument');
    console.log(this.intrument);
  }

  ionViewDidEnter() {
    //this.logProvider.getLogDetail(this.navParams.get('logId')).then(logSnap => {
    //  this.currentLog = logSnap;
    //});
  }

  addGuest(guestName) {
    this.logProvider.addGuest(guestName, this.currentLog.id, this.currentLog.price,
      this.guestPicture).then(() => {
        this.guestName = '';
        this.guestPicture = null;
      });
  }

  takePicture() {
    this.cameraPlugin.getPicture({
      quality: 95,
      destinationType: this.cameraPlugin.DestinationType.DATA_URL,
      sourceType: this.cameraPlugin.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.cameraPlugin.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.guestPicture = imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

}
