import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VirtualJournalServiceService {

  vj_event: any;

  onEvent(vj_event: any) {
    this.vj_event = vj_event;
    // JSON.stringify(this.vj_event)
    console.log(this.vj_event)
  }

}
