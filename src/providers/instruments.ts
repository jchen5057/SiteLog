import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Instruments {
    instruments: any;
    selectedInstrument: any;

    constructor(public http: Http, public db: AngularFireDatabase) {
        console.log('Hello Instruments Provider');
        //this.upload2firebase();
        //this.load();
    }

    load() {
        if (this.instruments) {
            return Promise.resolve(this.instruments);
        }

        return new Promise(resolve => {
            this.db.list('/instruments', {
                query: {
                    orderByChild: 'Name'
                }
            }).subscribe(instruments => {
                this.instruments = instruments;
                resolve(this.instruments);
            });
        });
    }

    upload2firebase() {
        this.http.get('assets/data/instruments.json').map(res => res.json()).subscribe(data => {
            data.instruments.forEach(instrument => {
                this.db.list(`/instruments`).push(instrument);
            });
        });
    }
}