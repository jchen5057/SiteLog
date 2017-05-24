import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';

@Injectable()
export class LogProvider {
  public userId: string;

  constructor(private http: Http, public db: AngularFireDatabase) {
    /*
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
      }
    })*/
  }

  getLogDetail(instrument): FirebaseListObservable<any[]> {
    return this.db.list(`/sitelog/${instrument.InstrumentNo}`, {
      query: {
        orderByChild: 'LT',
        //equalTo: instrument.SiteName
      }
    });
  }

  addLog(instrumentNo, logData) {
    this.db.list(`/sitelog/${instrumentNo}`).push(logData);
  }

  /*
  addLog(guestName, logId, logPrice, guestPicture = null): firebase.Promise<any> {
    return firebase.database().ref(`userProfile/${this.userId}/logList`)
      .child(logId).child('guestList').push({
        guestName: guestName
      }).then((newGuest) => {
        firebase.database().ref(`userProfile/${this.userId}/logList`)
          .child(logId).transaction(log => {
            log.revenue += logPrice;
            return log;
          });
        if (guestPicture != null) {
          firebase.storage().ref('/guestProfile/').child(newGuest.key)
            .child('profilePicture.png').putString(guestPicture, 'base64', { contentType: 'image/png' })
            .then((savedPicture) => {
              firebase.database().ref(`userProfile/${this.userId}/logList`)
                .child(logId).child('guestList').child(newGuest.key).child('profilePicture')
                .set(savedPicture.downloadURL);
            });
        }
      });
  }*/

  //convert csv to json
  csvData: any[] = [];
  csvURL: string = 'assets/data/sitelog.csv';
  readCsvData() {

    this.http.get(this.csvURL)
      .subscribe(
      data => this.extractData(data),
      err => this.handleError(err)
      );

  }

  private extractData(res: Response) {
    console.log(res);
    let headers = ['SiteLogID', 'SiteID', 'InstrumentID', 'Note', 'LT', 'DisplayUserName', 'InstrumentNo', 'Name', 'StationID', 'SiteName'];

    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    //let headers = allTextLines[0].split(',');
    let lines = [];

    for (let i = 0; i < allTextLines.length; i++) {
      // split content based on comma
      let data = allTextLines[i].split(',');
      if (data.length == headers.length) {
        let tarr = [];
        let line0;
        for (let j = 0; j < headers.length; j++) {
          //line0 = `"${headers[j]}":${data[j].trim()}`;

          switch (j) {
            case 0:
            case 1:
            case 2:
              line0 = `"${headers[j]}":${data[j].trim()}`;
              break;
            default:
              let text = data[j].replace('"', '\"').trim();
              line0 = `"${headers[j]}":"${text}"`;
          }
          tarr.push(line0);
        }
        lines.push(`{${tarr}}`);
      }
      //if (i > 5) break;
    }
    this.csvData = lines;
    let json = `{"sitelog":[${lines}]}`;
    console.clear();
    console.log(json);
    this.uploadData();
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return errMsg;
  }
  uploadData() {
    console.log('upload sitelog--- start');
    let headers = ['SiteLogID', 'SiteID', 'InstrumentID', 'Note', 'LT', 'DisplayUserName', 'InstrumentNo', 'Name', 'StationID', 'SiteName'];

    this.http.get('assets/data/sitelog.csv').subscribe(data => {
      let csvData = data['_body'] || '';
      let allTextLines = csvData.split(/\r\n|\n/);
      for (let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        let data = allTextLines[i].split(',');
        if (data.length == headers.length) {
          let date = new Date(data[4]);
          let yy = date.getUTCFullYear();
          let MM = date.getUTCMonth();
          let dd = date.getUTCDate();
          let hh = date.getUTCHours();
          let mm = date.getUTCMinutes();
          let ss = date.getUTCSeconds();
          let ms = date.getUTCMilliseconds();
          let ts = Date.UTC(yy, MM, dd, hh, mm, ss, ms);

          let line = { InstrumentNo: data[6], Name: data[7], StationID: data[8], SiteName: data[9], Note: data[3], LT: ts, User: data[5] };
          this.db.list(`/sitelog/${line.InstrumentNo}`).push(line);
        }
        //if (i > 5) break;
      }

      console.log('upload sitelog--- done!');
    });
  }
}