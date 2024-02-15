import { Component } from '@angular/core';
import { Item } from '../../models/item';
import { LineItem } from '../../models/line-item';

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

  public addItem(item: Item) {
    console.log(`${item.name} added to the basket`);
  };

  public clearBasket() {
    console.log('Basket cleared.');
  };

  public voidLineItem() {

  };

  public voidBasket() {

  };

  public tender(payment: string) {

  }

  public captureItemData(lineItem: LineItem) {
    
  }
}
