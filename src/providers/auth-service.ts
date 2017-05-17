import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
// Do not import from 'firebase' as you'll lose the tree shaking benefits
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {
  public authState: Observable<firebase.User>;
  public currentUser: firebase.User;

  constructor(public afAuth: AngularFireAuth) {
    this.authState = afAuth.authState;
    afAuth.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
      if (user && !this.currentUser.displayName) {
        let _displayName = this.displayName();
        let _photo = 'assets/icon/baaqmd_icon.png';
        this.currentUser.updateProfile({
          displayName: _displayName,
          photoURL: _photo
        });
      }
    });
  }

  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  loginUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.currentUser = newUser;
      this.newProfile();
    });
  }

  resetPassword(email: string): firebase.Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): firebase.Promise<void> {
    firebase.database().ref('/userProfile').child(firebase.auth().currentUser.uid).off();
    return this.afAuth.auth.signOut();
  }

  signInWithFacebook(): firebase.Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  newProfile() {
    let profile = {
      email: this.currentUser.email,
      firstName: '',
      lastName: '',
      workPhone: '',
      cellPhone: '',
    };
    firebase.database().ref('/userProfile').child(this.currentUser.uid).set(profile);
    return profile;
  }

  displayName(): string {
    if (this.currentUser !== null) {
      return this.currentUser.displayName || this.currentUser.email.split('@')[0];
    } else {
      return '';
    }
  }
}
