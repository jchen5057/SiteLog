import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventProvider {

  constructor() {}

  getEventList(): firebase.database.Reference {
    return firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`);
  }

  getEventDetail(eventId): firebase.database.Reference {
    return firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`)
      .child(eventId);
  }

  createEvent(eventName: string, eventDate: string, eventPrice: number, 
    eventCost: number): firebase.Promise<any> {
    return firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`).push({
      name: eventName,
      date: eventDate,
      price: eventPrice * 1,
      cost: eventCost * 1,
      revenue: eventCost * -1
    });
  }

  addGuest(guestName, eventId, eventPrice, guestPicture = null): firebase.Promise<any> {
    return firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`)
    .child(eventId).child('guestList').push({
      guestName: guestName
    }).then((newGuest) => {
      firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`)
      .child(eventId).transaction( (event) => {
        event.revenue += eventPrice;
        return event;
      });
      if (guestPicture != null) {
        firebase.storage().ref('/guestProfile/').child(newGuest.key)
        .child('profilePicture.png').putString(guestPicture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}/eventList`)
          .child(eventId).child('guestList').child(newGuest.key).child('profilePicture')
          .set(savedPicture.downloadURL);
        });        
      }
    });
  }

}
