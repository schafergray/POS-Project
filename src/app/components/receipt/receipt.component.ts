import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineItem } from '../../models/line-item';
import { Basket } from '../../models/basket';
import { RegisterService } from '../../services/register.service';
import RegisterComponent from '../register/register.component';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent implements OnInit {

  shouldVoid: boolean = false;
  toBeVoided!: LineItem;

  registerBasket!: Basket;

  constructor(
    private registerService: RegisterService,
    private receiptService: ReceiptService,
    private register: RegisterComponent
    ) {
      this.registerService.handleEvent.subscribe({
        next: (event: any) => {
          this.registerBasket = event.basket;
        }
      });
  }

  ngOnInit(): void {
    this.registerBasket = this.register.getInitialBasket();
  }

  public captureLineItem = new EventEmitter<any>();

  public async handleEvent(eventAction: string, listenerMessage?: string, data?: any) {
    this.receiptService.captureLineItem.emit({
      action: eventAction,
      message: listenerMessage,
      data: data
    });
  }

}
