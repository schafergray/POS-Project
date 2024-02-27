import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  handleEvent = new EventEmitter<any>();

  constructor() { }
}
