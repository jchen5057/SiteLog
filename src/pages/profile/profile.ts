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
  public userProfile: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public profileProvider: ProfileProvider, public auth: AuthService, db: AngularFireDatabase) {
    if (auth.currentUser) {
      db.object(`/userProfile/${auth.currentUser.uid}`).subscribe(p => {
        this.userProfile = p;
      });
    } else {
      this.navCtrl.setRoot('login');
    }
  }

  ionViewDidEnter() {
    /*
    this.profileProvider.getUserProfile().then(profileSnap => {
      if (profileSnap) {
        console.log(profileSnap);
        this.userProfile = profileSnap;
      } else {
        this.userProfile = this.auth.newProfile();
      }
    });*/
  }

  logOut() {
    this.auth.logoutUser().then(() => {
      this.navCtrl.setRoot('login');
    });
  }

  updateName() {
    let alert = this.alertCtrl.create({
      message: "Your first name & last name",
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName || ''
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName || ''
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updatePhone() {
    let alert = this.alertCtrl.create({
      message: "Contact Phone #",
      inputs: [
        {
          name: 'workPhone',
          placeholder: 'Your work phone#',
          value: this.userProfile.workPhone || ''
        },
        {
          name: 'cellPhone',
          placeholder: 'Your cell phone#',
          value: this.userProfile.cellPhone || ''
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePhone(data.workPhone, data.cellPhone);            
          }
        }
      ]
    });
    alert.present();
  }

  /*
  updateEmail() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
        {
          name: 'password',
          placeholder: 'Your password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateEmail(data.newEmail, data.password);
          }
        }
      ]
    });
    alert.present();
  }*/

  updatePassword() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
        {
          name: 'oldPassword',
          placeholder: 'Your old password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(data.newPassword, data.oldPassword);
          }
        }
      ]
    });
    alert.present();
  }

}
