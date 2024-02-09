import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('barcodeInput') barcodeInput!: ElementRef;
  barcode: any;
  count: number = 0;
  shouldVoid: boolean = false;
  toBeVoided: any;
  lineItem: LineItem[]= [];
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
  fullPricebookArray: any = [];
  pricebook: Item[] = [];

  constructor(private http: HttpClient){
  }

  ngOnInit(): void {
    this.getCurrentPosition().subscribe({
      next: (position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
      },
      error: (error) => {
        console.error('Error getting geolocation:', error);
      },
    });
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

  public handleBarcodeInput(event: any) {
    this.barcode = event.target.value;
    this.pricebook.forEach((item: Item) => {
      if (item.code === this.barcode) {
        this.addItem(item);
      }
    })
  }


  public getCurrentPosition(): Observable<any> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not available in this browser.');
      }
    });
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
    if (this.basket.lineItems.length === 0) {
      this.basketStarted();
    };
    this.lineItem.push({
      item: item,
      quantity: 1,
      voided: false
    });
      // let exists = false;
      // this.lineItem.forEach( (lineItem: LineItem) => {
      //   if(lineItem.item === item) {
      //     lineItem.quantity = lineItem.quantity + 1;
      //     exists = true;
      //   }
      // })
      // if(exists === false) {
      //   this.lineItem.push({
      //     item: item,
      //     quantity: 1,
      //     voided: false
      //   });
      // }
    
    this.subTotal = Number((this.subTotal + item.price).toFixed(2));
    this.taxApplied = Number((this.subTotal * 0.07).toFixed(2));
    this.total = Number((this.subTotal + this.taxApplied).toFixed(2));
    this.barcodeInput.nativeElement.focus();
  }

  public clearBasket() {
    this.lineItem = [];
    this.basket = {
      receiptNumber: this.basket.receiptNumber,
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
    this.barcodeInput.nativeElement.focus();
  }

  public captureItemData(lineItem: LineItem) {
    if(lineItem.voided === true) {
      return;
    }
    this.toBeVoided = lineItem;
    this.shouldVoid = true;
    this.barcodeInput.nativeElement.focus();
  }

  public voidLineItem() {
    this.toBeVoided.quantity = 0;
    this.toBeVoided.voided = true;
    this.subTotal = Number((this.subTotal - this.toBeVoided.item.price).toFixed(2));
    this.taxApplied = Number((this.subTotal * 0.07).toFixed(2));
    this.total = Number((this.subTotal + this.taxApplied).toFixed(2));
    this.shouldVoid = false;
    this.barcodeInput.nativeElement.focus();
  }

  public voidBasket() {
    this.shouldVoid = false;
    this.lineItem.forEach( (lineItem: LineItem) => {
      lineItem.quantity = 0;
      lineItem.voided = true;
    })
    this.subTotal = 0;
    this.taxApplied = 0;
    this.total = 0;
    this.barcodeInput.nativeElement.focus();
  }

  public tender(payment: string) {
    // based on payment type whether it's exact cash or credit
  }

  public basketStarted(): boolean {
    this.basketStart = true;
    this.basket.receiptNumber = this.basket.receiptNumber + 1;
    return this.basketStart;
  }

  public basketEnded() {
    this.basketEnd = true;
    return this.basketEnd;
  }

  public prev() {
    if (this.startingItems === 0) {
    this.barcodeInput.nativeElement.focus();
      return;
    } else {
      this.pricebook = [];
      this.startingItems = this.startingItems - 20;
      this.displayedItems = this.displayedItems - 20;
      for (let i=this.startingItems; i<this.displayedItems; i++) {
        this.pricebook.push(this.fullPricebookArray[i])
      }
    }
    this.barcodeInput.nativeElement.focus();
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
    this.barcodeInput.nativeElement.focus();
  }
}

export default PosComponent;
