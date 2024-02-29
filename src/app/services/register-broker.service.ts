import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterBrokerService {

  handleEvent = new EventEmitter<any>();

  constructor() { }
}
