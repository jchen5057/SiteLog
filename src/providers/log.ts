import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class LogProvider {
  public userId:string;
  
  constructor() {
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        this.userId = user.uid;
      }
    })
  }

  getLogList(): Promise<any> {
    return new Promise( (resolve, reject) => {
      firebase.database().ref(`userProfile/${this.userId}/logList`)
      .on('value', snapshot => {
        let rawList = [];
        snapshot.forEach( snap => {
          rawList.push({
            id: snap.key,
            name: snap.val().name,
            price: snap.val().price,
            date: snap.val().date,
          });
        return false
        });
        resolve(rawList);
      });
    });

  }

  getLogDetail(logId): Promise<any> {
    return new Promise( (resolve, reject) => {
      firebase.database().ref(`userProfile/${this.userId}/logList`)
      .child(logId).on('value', snapshot => {
        resolve({
          id: snapshot.key,
          name: snapshot.val().name,
          date: snapshot.val().date,
          price: snapshot.val().price,
          cost: snapshot.val().cost,
          revenue: snapshot.val().revenue
        });
      });
    });
  }

  createLog(logName: string, logDate: string, logPrice: number, 
    logCost: number): firebase.Promise<any> {
    return firebase.database().ref(`userProfile/${this.userId}/logList`).push({
      name: logName,
      date: logDate,
      price: logPrice * 1,
      cost: logCost * 1,
      revenue: logCost * -1
    });
  }

  addGuest(guestName, logId, logPrice, guestPicture = null): firebase.Promise<any> {
    return firebase.database().ref(`userProfile/${this.userId}/logList`)
    .child(logId).child('guestList').push({
      guestName: guestName
    }).then((newGuest) => {
      firebase.database().ref(`userProfile/${this.userId}/logList`)
      .child(logId).transaction( log => {
        log.revenue += logPrice;
        return log;
      });
      if (guestPicture != null) {
        firebase.storage().ref('/guestProfile/').child(newGuest.key)
        .child('profilePicture.png').putString(guestPicture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          firebase.database().ref(`userProfile/${this.userId}/logList`)
          .child(logId).child('guestList').child(newGuest.key).child('profilePicture')
          .set(savedPicture.downloadURL);
        });        
      }
    });
  }

}
