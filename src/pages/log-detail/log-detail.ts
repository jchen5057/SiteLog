import { Component, ViewChild } from '@angular/core';
import { IonicPage, Content, TextInput, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

import { LogProvider } from '../../providers/log';
import { AuthService } from '../../providers/auth-service';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

@IonicPage({
  name: 'log-detail',
  segment: 'log-detail/:logId'
})
@Component({
  selector: 'page-log-detail',
  templateUrl: 'log-detail.html',
})
export class LogDetailPage {
  @ViewChild('logContent') logContent: Content;
  @ViewChild('logTextArea') logTextArea: TextInput;

  public station: any;
  public instrument: any;
  public currentLog: FirebaseListObservable<any[]>;
  public logText: string = '';
  logPicture: string = null;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public logProvider: LogProvider, private auth: AuthService,
    private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) {

    this.station = navParams.get('station');
    this.instrument = navParams.get('instrument');
    console.log(this.instrument);
    //this.logProvider.readCsvData();
    //this.logProvider.uploadData();

    this.currentLog = logProvider.getLogDetail(this.instrument);
  }

  ionViewDidLoad() {
  }
  ionViewDidEnter() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.logContent.scrollToBottom();
    loading.dismiss();
  }

  activeCheck() {
    if (this.instrument.IsActive) {
      this.logText = 'Changed Instrument to Active Status';
    } else {
      this.logText = 'Changed Instrument to Inactive Status';
    }
  }

  tapEvent(log) {

  }
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      //this.lastImage = newFileName;
      this.logPicture = newFileName;
      console.log(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  /*
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
      this.logPicture = imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }*/

  triggerFile(fileInput: HTMLInputElement) {
    // do something
    fileInput.click();
  }

  clear() {
    this.logText = '';
    this.logPicture = null;
  }

  save() {
    if (!this.logText) {
      this.logTextArea.setFocus();
    } else if (this.logPicture) {
      let timestamp = Date.now();
      let storageRef = firebase.storage().ref();
      let path = `/siteLog/${this.instrument.InstrumentNo}/${this.station.Name}/${timestamp}`;
      let iRef = storageRef.child(path);
      iRef.put(this.logPicture)
        //iRef.putString(this.logPicture, 'base64', { contentType: 'image/png' })
        .then((savedPicture) => {
          this.upload(savedPicture.downloadURL);
        });
    } else if ((<HTMLInputElement>document.getElementById('file')).files[0]) {
      let timestamp = Date.now();
      let storageRef = firebase.storage().ref();
      for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
        let path = `/siteLog/${this.instrument.InstrumentNo}/${this.station.Name}/${timestamp}`;
        let iRef = storageRef.child(path);
        iRef.put(selectedFile)
          .then((savedPicture) => {
            this.upload(savedPicture.downloadURL);
          });
      }
    } else {
      this.upload('');
    }
  }

  upload(photoURL: string) {
    if (this.logText) {
      let logData = {
        InstrumentNo: this.instrument.InstrumentNo,
        LT: Date.now(),
        Name: this.instrument.Name,
        Note: this.logText,
        photoURL: photoURL || '',
        SiteName: this.station.Name,
        StationID: this.station.StationID,
        User: this.auth.displayName(),
      }
      this.logProvider.addLog(this.instrument.InstrumentNo, logData)
      this.logText = '';
      this.logPicture = null;

      this.presentToast('New Log added...');
    }
  }
}
