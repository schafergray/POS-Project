import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineItem } from '../../models/line-item';
import { Basket } from '../../models/basket';
import { RegisterBrokerService } from '../../services/register-broker.service';
import RegisterComponent from '../register/register.component';
import { ReceiptBrokerService } from '../../services/receipt-broker.service';

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
    private registerService: RegisterBrokerService,
    private receiptService: ReceiptBrokerService,
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
