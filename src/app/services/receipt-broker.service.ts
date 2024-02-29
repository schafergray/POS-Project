import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceiptBrokerService {


  captureLineItem = new EventEmitter<any>();

  constructor() { }
}
