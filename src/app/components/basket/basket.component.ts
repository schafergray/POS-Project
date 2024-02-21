import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineItem } from '../../models/line-item';
import { Basket } from '../../models/basket';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit, OnDestroy {
  private _serviceSubscription: any;

  shouldVoid: boolean = false;
  toBeVoided!: LineItem;

  initialBasket: Basket = {
    basketStarted: false,
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

  basket!: Basket;

  constructor(
    private eventsService: EventsService) {
      this._serviceSubscription = this.eventsService.handleEvent.subscribe({
        next: (event: any) => {
          this.basket = event.basket;
        }
      })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._serviceSubscription.unsubscribe();
  }

  public getInitialBasketInfo() {
    return this.initialBasket;
  }

}
