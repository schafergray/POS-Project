import { Component } from '@angular/core';
import { LineItem } from '../../models/line-item';
import { Basket } from '../../models/basket';

@Component({
  selector: 'app-virtual-journal',
  standalone: true,
  imports: [],
  templateUrl: './virtual-journal.component.html',
  styleUrl: './virtual-journal.component.css'
})
export class VirtualJournalComponent {
  localStorageKey: number = 0

  constructor() {
  };

  public addItem(basket: Basket) {
    this.localStorageKey = this.localStorageKey + 1;
    localStorage.setItem(`Item added to the basket ${this.localStorageKey}`, JSON.stringify(basket))
    console.log('Item added to the basket.', new Date(), basket);
  };

  public clearBasket(basket: Basket) {
    this.localStorageKey = this.localStorageKey + 1;
    localStorage.setItem(`Basket cleared ${this.localStorageKey}`, JSON.stringify(basket))
    console.log('Basket cleared.', new Date(), basket);
  };

  public voidLineItem(basket: Basket) {
    this.localStorageKey = this.localStorageKey + 1;
    localStorage.setItem(`Line Item voided ${this.localStorageKey}`, JSON.stringify(basket))
    console.log('Line Item voided.', new Date(), basket);
  };

  public voidBasket(basket: Basket) {
    this.localStorageKey = this.localStorageKey + 1;
    localStorage.setItem(`Basket voided ${this.localStorageKey}`, JSON.stringify(basket))
    console.log('Basket voided.', new Date(), basket);
  };

  public tender(payment: string, basket: Basket) {
    this.localStorageKey = this.localStorageKey + 1;
    localStorage.setItem(`Basket tendered in ${payment} ${this.localStorageKey}`, JSON.stringify(basket))
    console.log(`Basket tendered in ${payment}`, new Date(), basket)
  }

  public captureItemData(lineItem: LineItem) {
    this.localStorageKey = this.localStorageKey + 1;
    localStorage.setItem(`Line item selected ${this.localStorageKey}`, JSON.stringify(lineItem))
    console.log('Line item selected.', new Date(), lineItem)
  }

  public updateLocation(location: any) {
    this.localStorageKey = this.localStorageKey + 1;
    localStorage.setItem(`Location updated ${this.localStorageKey}`, JSON.stringify(location))
    console.log(`Location updated to ${location.address.Address}, ${location.address.City}, ${location.address.RegionAbbr}`,  new Date());
  }
}
