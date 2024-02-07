import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/item';
import { LineItem } from '../../models/line-item';
import { Basket } from '../../models/basket';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css'
})
export class PosComponent implements OnInit {
  currentBasket: number = 0;
  lineItem: LineItem[]= [];
  item: Item[] = [];
  basket: Basket = {
    receiptNumber: 0,
    cashierName: '',
    cashierId: 0,
    date: new Date(),
    location: '',
    voided: false,
    lineItems: this.lineItem,
  };
  basketStart: boolean = false;
  basketEnd: boolean = true;
  subTotal: number = 0;
  taxApplied: number = 0;
  total: number = 0;
  displayedItems: number = 20;
  startingItems: number = 0;

  public fullPricebookArray: any = [];
  public pricebook: Item[] = [];
  constructor(private http: HttpClient){
  }

  ngOnInit(): void {
    this.parseCSV().subscribe({
      next: (data: any) => {
        let csvToRowArray = data.split("\n");
        csvToRowArray.forEach((el: string) => {
          let item = el.split("\t")
          this.fullPricebookArray.push({
            code: item[0],
            name: item[1],
            price: Number(item[2])
          });
        });
        for (let i=this.startingItems; i<this.displayedItems; i++) {
          this.pricebook.push(this.fullPricebookArray[i])
        }
      }
    })
  }

  public parseCSV(): Observable<String> {
    return this.http.get('assets/pricebook.csv', {responseType: 'text'})
  }

  public accessDB() {
    let db;
    const request = indexedDB.open("POSDatabase");
    request.onerror = (event) => {
      console.error("Cannot access IndexedDB at this time!");
    };
    request.onsuccess = (event: any) => {
      db = event.target.result;
};
  }

  public addItem(item: Item) {
    this.item.push(item);
    this.lineItem.push({
      items: this.item,
      quantity: 1,
      voided: false
    })
    this.subTotal = this.subTotal + this.basket.lineItems[0].items[this.basket.lineItems[0].items.length - 1].price;
    this.subTotal = Number(this.subTotal.toFixed(2));
  }

  public removeItem(item: Item) {
    // remove Item here
  }

  public clearBasket() {
    this.item = [];
    this.lineItem = [];
    this.basket = {
      receiptNumber: 0,
      cashierName: '',
      cashierId: 0,
      date: new Date(),
      location: '',
      voided: false,
      lineItems: this.lineItem
    }
    this.subTotal = 0;
    this.taxApplied = 0;
    this.total = 0;
  }

  public voidItem() {
    // void Item here
  }

  public voidBasket() {
    // void entire Basket here
  }

  public tender(payment: string) {
    // based on payment type whether it's exact cash or credit
  }

  public basketStarted(): boolean {
    this.basketStart = true;
    return this.basketStart;
  }

  public basketEnded() {
    this.basketEnd = true;
    return this.basketEnd;
  }

  public prev() {
    if (this.startingItems === 0) {
      return;
    } else {
      this.pricebook = [];
      this.startingItems = this.startingItems - 20;
      this.displayedItems = this.displayedItems - 20;
      for (let i=this.startingItems; i<this.displayedItems; i++) {
        this.pricebook.push(this.fullPricebookArray[i])
      }
    }
    
  }

  public next() {
    if (this.displayedItems > this.fullPricebookArray.length) {
      return;
    } else {
      this.pricebook = [];
      this.startingItems = this.startingItems + 20;
      this.displayedItems = this.displayedItems + 20;
      for (let i=this.startingItems; i<this.displayedItems; i++) {
        this.pricebook.push(this.fullPricebookArray[i])
      }
    }
    
  }
}

export default PosComponent;
