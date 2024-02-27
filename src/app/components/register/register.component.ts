import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../models/item';
import { LineItem } from '../../models/line-item';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasketComponent } from '../basket/basket.component';
import { Basket } from '../../models/basket';
import { VirtualJournalComponent } from '../virtual-journal/virtual-journal.component';
import { EventsService } from '../../services/events.service';
import { DiscountsService } from '../../services/discounts.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, BasketComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [EventsService, DiscountsService]
})
export class RegisterComponent implements OnInit, OnDestroy {
  self: any;
  private _serviceSubscription: any;

  basketComponent = new BasketComponent(this.eventsService);
  virtualJournalComponent = new VirtualJournalComponent(this.eventsService);
  listeners: any = [this.basketComponent, this.virtualJournalComponent];

  basket!: Basket;
  totalAmount: boolean = false;
  readyForTender: boolean = false;
  disableButtons: boolean = false;

  @HostListener('window:keydown', ['$event'])
  handleBarcodeInput(event: KeyboardEvent) {
    if(event.key !== "Enter") {
      this.barcode = this.barcode + event.key;
    } else if (event.key === "Enter") {
      this.fullPricebookArray.forEach((item: Item) => {
        if (item.code === Number(this.barcode)) {
          this.handleEvent('addItem', 'Item added', item);
        }
      })
      this.barcode = '';
    }
  }

  returnObj: any = {};

  barcode: string = '';
  shouldVoid: boolean = false;
  toBeVoided!: LineItem;

  displayedItems: number = 20;
  startingItems: number = 0;

  fullPricebookArray: Item[] = [];
  pricebook: Item[] = [];

  constructor (
    private http: HttpClient,
    private eventsService: EventsService,
    private discountsService: DiscountsService) {
      this._serviceSubscription = this.eventsService.captureLineItem.subscribe({
        next: (event: any) => {
          this.handleEvent(event.action, event.message, event.data);
        }
      });
      this.self = this;
  }

  ngOnInit(): void {
    localStorage.clear();
    this.basket = this.basketComponent.getInitialBasketInfo();

    this.getCurrentPosition().subscribe({
      next: (position) => {
        this.getLocation(position.coords.latitude, position.coords.longitude).subscribe({
          next: (location: any) => {
            this.handleEvent('updateLocation', 'Location updated', location)
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

  ngOnDestroy(): void {
    this._serviceSubscription.unsubscribe();
  };

// ============= These methods are called in ngOnInit() to get location and parse CSV pricebook file
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

  public updateLocation (location: any) {
    this.basket.location = location.address.Address + ', ' + location.address.City + ', ' + location.address.RegionAbbr;
  }
// =============

// ============= This is the event handler method
public async handleEvent(eventAction: string, listenerMessage?: string, data?: any) {
  await this.self[`${eventAction}`](data);
  this.eventsService.handleEvent.emit({
    basket: this.basket,
    message: listenerMessage,
    data: data
  });
}
// =============

// ============= These are the methods that manipulate the basket
  public basketStarted() {
    this.basket.basketStarted = true;
    this.basket.receiptNumber = this.basket.receiptNumber + 1;
    this.basket.date = new Date();
    };

  public basketEnded() {
    this.basket.basketStarted = false;
    this.handleEvent('clearBasket', 'Basket cleared')
  }

  public addItem(item: Item) {
    if(!this.basket.basketStarted) {
      this.handleEvent('basketStarted', 'New basket started');
    }
      this.basket.lineItems.push({
        item: item,
        quantity: 1,
        voided: false
      });
      this.basket.subTotal = Number((this.basket.subTotal + item.price).toFixed(2));
      this.basket.taxApplied = Number((this.basket.subTotal * 0.07).toFixed(2));
      this.basket.total = Number((this.basket.subTotal + this.basket.taxApplied).toFixed(2));
  }

  public captureItemData(lineItem: LineItem) {
    if(lineItem.voided ) {
      return false;
    } else {
      this.toBeVoided = lineItem;
      this.shouldVoid = true;
      return {toBeVoided: this.toBeVoided, shouldVoid: this.shouldVoid}
    }
  }

  public voidLineItem() {
    this.toBeVoided.quantity = 0;
    this.toBeVoided.voided = true;
    this.basket.subTotal = Number((this.basket.subTotal - this.toBeVoided.item.price).toFixed(2));
    this.basket.taxApplied = Number((this.basket.subTotal * 0.07).toFixed(2));
    this.basket.total = Number((this.basket.subTotal + this.basket.taxApplied).toFixed(2));
    this.shouldVoid = false;
  }

  public voidBasket() {
    this.disableButtons = true;
    this.readyForTender = false;
    this.totalAmount = true;
    this.shouldVoid = false;
    this.basket.lineItems.forEach( (lineItem: LineItem) => {
      lineItem.quantity = 0;
      lineItem.voided = true;
    })
    this.basket.voided = true;
    this.basket.subTotal = 0;
    this.basket.taxApplied = 0;
    this.basket.total = 0;
    setTimeout(() => {
      this.handleEvent('basketEnded', 'Basket ended');
    }, 1500)
  }

  public clearBasket() {
    this.basket.voided = false;
    this.basket.lineItems = [];
    this.basket.subTotal = 0;
    this.basket.taxApplied = 0;
    this.basket.total = 0;
    this.totalAmount = false;
    this.disableButtons = false;
    };

  public async total() {
    await this.discountsService.checkForDiscounts(this.basket).subscribe((res: any) => {
      let response = JSON.parse(res);
      this.basket.total = Number((this.basket.total - response.discount).toFixed(2));
      this.totalAmount = true;
      this.readyForTender = true;
      if (response.discount > 0) {
        alert('Discounts applied!');
      };
    });
  };

  public tender(payment: string) {
    this.disableButtons = true;
    this.readyForTender = false;
    this.shouldVoid = false;
    if(payment === 'cash'){
      alert('Exact cash paid. Basket ended.');
    } else if(payment === 'credit') {
      alert('Credit paid. Basket ended.');
    };
    setTimeout(() => {
      this.handleEvent('basketEnded', 'Basket ended');
    }, 1500);
  };
// =============

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

export default RegisterComponent;
