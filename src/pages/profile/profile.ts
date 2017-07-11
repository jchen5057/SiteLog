import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase/app';
import 'firebase/storage';

import { ProfileProvider } from '../../providers/profile';
import { AuthService } from '../../providers/auth-service';

interface Image {
  path: string;
  filename: string;
  downloadURL?: string;
  $key?: string;
}

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public displayName: string;
  public photoURL: any;
  public email: string;
  public password: string;
  public workPhone: any; cellPhone: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public profileProvider: ProfileProvider, public auth: AuthService, public db: AngularFireDatabase) {
    if (auth.currentUser) {
      this.displayName = auth.currentUser.displayName;
      this.photoURL = auth.currentUser.photoURL;
      this.email = auth.currentUser.email;

      db.object(`/userProfile/${auth.currentUser.uid}`).subscribe(p => {
        this.workPhone = p.workPhone || '';
        this.cellPhone = p.cellPhone || '';
      });
    } else {
      this.navCtrl.setRoot('login');
    }
  }

  ionViewDidEnter() {

  }

  logOut() {
    this.auth.logoutUser().then(() => {
      this.navCtrl.setRoot('login');
    });
  }

  resetPassword() {
    this.auth.resetPassword(this.email);
  }

  save() {
    this.auth.currentUser.updateProfile({
      displayName: this.displayName,
      photoURL: this.photoURL
    });

    this.db.object(`/userProfile/${this.auth.currentUser.uid}`).update({
      workPhone: this.workPhone,
      cellPhone: this.cellPhone,
      photoURL: this.photoURL
    });
  }
  openFileDialog() {
    console.log('fire! $scope.openFileDialog()');
    //trigger('click', { target: document.getElementById('file') });
  };

  upload() {
    // Create a root reference
    let storageRef = firebase.storage().ref();

    // This currently only grabs item 0, TODO refactor it to grab them all
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('file')).files[0]]) {
      let path = `/avatar/${this.auth.currentUser.uid}`;
      var iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        this.photoURL = snapshot.downloadURL;
        this.auth.currentUser.updateProfile({
          displayName: this.displayName,
          photoURL: this.photoURL
        });
      });
    }
  }

}
