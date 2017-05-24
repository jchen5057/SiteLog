import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { ProfileProvider } from '../../providers/profile';
import { AuthService } from '../../providers/auth-service';

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
      cellPhone: this.cellPhone
    });
  }
}
