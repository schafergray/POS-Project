import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  handleEvent = new EventEmitter<any>();
  captureLineItem = new EventEmitter<any>();

  constructor() { }
}
