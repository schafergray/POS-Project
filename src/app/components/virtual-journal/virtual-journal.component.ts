import { Component } from '@angular/core';
import { Item } from '../../models/item';
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

  constructor() {
  };

  public addItem(basket: Basket) {
    console.log('Item added to the basket.', new Date(), basket);
  };

  public clearBasket(basket: Basket) {
    console.log('Basket cleared.', new Date(), basket);
  };

  public voidLineItem(basket: Basket) {
    console.log('Line Item voided.', new Date(), basket);
  };

  public voidBasket(basket: Basket) {
    console.log('Basket voided.', new Date(), basket);
  };

  public tender(payment: string, basket: Basket) {
    console.log(`Basket tendered in ${payment}`, new Date(), basket)
  }

  public captureItemData(lineItem: LineItem) {
    console.log('Line item selected.', new Date(), lineItem)
  }

  public updateLocation(location: any) {
    console.log(`Location updated to ${location.address.Address}, ${location.address.City}, ${location.address.RegionAbbr}`,  new Date(),);
  }
}
