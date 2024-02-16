import { Component, HostListener, OnInit } from '@angular/core';
import { Item } from '../../models/item';
import { LineItem } from '../../models/line-item';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasketComponent } from '../basket/basket.component';
import { Basket } from '../../models/basket';
import { VirtualJournalComponent } from '../virtual-journal/virtual-journal.component';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, BasketComponent],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css'
})
export class PosComponent implements OnInit {

  @HostListener('window:keydown', ['$event'])
  handleBarcodeInput(event: KeyboardEvent) {
    if(event.key !== "Enter") {
      this.barcode = this.barcode + event.key;
    } else if (event.key === "Enter") {
      this.fullPricebookArray.forEach((item: Item) => {
        if (item.code === Number(this.barcode)) {
          this.addItem(item);
        }
      })
      this.barcode = '';
    }
  }

  returnObj: any = {};

  basketComponent = new BasketComponent(this.http);
  virtualJournalComponent = new VirtualJournalComponent();

  basket: Basket = {
    receiptNumber: 0,
    cashierName: 'Ned Stark',
    cashierId: 1234,
    date: new Date(),
    location: '',
    voided: false,
    lineItems: [],
    subTotal: 0,
    taxApplied: 0,
    total: 0,
  }

  barcode: string = '';
  shouldVoid: boolean = false;
  toBeVoided!: LineItem;

  listeners: any = [this.basketComponent, this.virtualJournalComponent];

  displayedItems: number = 20;
  startingItems: number = 0;

  fullPricebookArray: Item[] = [];
  pricebook: Item[] = [];

  constructor (
    private http: HttpClient,
    ) {
  }

  ngOnInit(): void {
    localStorage.clear();

    this.getCurrentPosition().subscribe({
      next: (position) => {
        this.getLocation(position.coords.latitude, position.coords.longitude).subscribe({
          next: (location: any) => {
            this.listeners.forEach((listener: any) => {
              if(listener === this.basketComponent) {
                this.basket = listener.updateLocation(location);
              } else {
                listener.updateLocation(location);
              }
              
            })
          },
          error: (error: any) => {
            console.error('Something has gone wrong.', error)
          }
        })
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
            code: Number(item[0]),
            name: item[1],
            price: Number(item[2])
          });
        });
        for (let i=this.startingItems; i<this.displayedItems; i++) {
          this.pricebook.push(this.fullPricebookArray[i])
        }
      }
    })
  };

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
  };

  public getLocation(lat: number, long: number) {
    return this.http.get(`https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${long},${lat}&f=json&token=AAPKd10bd6c383f04daabce9229c43e4cc577pQBOei4DowBmyCCfqfHXpUOu2meH0f63dVIRNMzG1ylva7sMxs8Tu7ZBlu1eT1U`, {responseType: 'json'});
  }

  public parseCSV(): Observable<String> {
    return this.http.get('assets/pricebook.tsv', {responseType: 'text'})
  }

  public addItem(item: Item) {
    this.listeners.forEach((listener: any) => {
      if( listener === this.basketComponent ) {
        this.basket = listener.addItem(item);
      } else {
        listener.addItem(this.basket);
      }
    });
  }

  public captureItemData(lineItem: LineItem) {
    this.listeners.forEach((listener: any) => {
      if( listener === this.basketComponent ) {
        this.returnObj = listener.captureItemData(lineItem);
        this.toBeVoided = this.returnObj.toBeVoided;
        this.shouldVoid = this.returnObj.shouldVoid;
      } else {
        listener.captureItemData(lineItem);
      }
      
    })
  }

  public voidLineItem() {
    this.listeners.forEach((listener: any) => {
      if( listener === this.basketComponent ) {
        this.returnObj = listener.voidLineItem(this.toBeVoided);
        this.basket = this.returnObj.basket;
        this.shouldVoid = this.returnObj.shouldVoid;
      } else {
        listener.voidLineItem(this.basket);
      }
    })
  }

  public voidBasket() {
    this.listeners.forEach((listener: any) => {
      if( listener === this.basketComponent ) {
        this.returnObj = listener.voidBasket();
        this.basket = this.returnObj.basket;
        this.shouldVoid = this.returnObj.shouldVoid;
      } else {
        listener.voidBasket(this.basket);
      }
    })
  }

  public tender(payment: string) {
    this.listeners.forEach((listener: any) => {
      if( listener === this.basketComponent ) {
        this.basket = listener.tender(payment);
      } else {
        listener.tender(payment, this.basket);
      }
    })
    this.clearBasket();
  }

  public clearBasket() {
    this.listeners.forEach((listener: any) => {
      if( listener === this.basketComponent ) {
        this.basket = listener.clearBasket();
      } else {
        listener.clearBasket(this.basket);
      }
      
    })
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
