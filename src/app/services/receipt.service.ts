import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {


  captureLineItem = new EventEmitter<any>();

  constructor() { }
}
