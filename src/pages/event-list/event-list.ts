import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';

@IonicPage({
  name: 'event-list'
})
@Component({
  selector: 'page-event-list',
  templateUrl: 'event-list.html',
})
export class EventListPage {
  public eventList: Array<any>;

  constructor(public navCtrl: NavController, public eventProvider: EventProvider) {}

  ionViewDidLoad() {
    this.eventProvider.getEventList().then( eventListSnap => {
      this.eventList = eventListSnap;
    });
  }

  goToEventDetail(eventId){
    this.navCtrl.push('event-detail', { 'eventId': eventId });
  }

}


  
