import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineItem } from '../../models/line-item';
import { Basket } from '../../models/basket';
import { RegisterService } from '../../services/register.service';
import RegisterComponent from '../register/register.component';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent implements OnInit, OnDestroy {
  private _serviceSubscription: any;

  shouldVoid: boolean = false;
  toBeVoided!: LineItem;

  basket!: Basket;

  constructor(
    private registerService: RegisterService,
    private register: RegisterComponent
    ) {
      this._serviceSubscription = this.registerService.handleEvent.subscribe({
        next: (event: any) => {
          this.basket = event.basket;
        }
      });
  }

  ngOnInit(): void {
    this.basket = this.register.getInitialBasket();
  }

  ngOnDestroy(): void {
    this._serviceSubscription.unsubscribe();
  };

  public captureLineItem = new EventEmitter<any>();

  public async handleEvent(eventAction: string, listenerMessage?: string, data?: any) {
    this.registerService.captureLineItem.emit({
      action: eventAction,
      message: listenerMessage,
      data: data
    });
  }

}
