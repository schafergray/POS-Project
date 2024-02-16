import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LineItem } from '../../models/line-item';
import { Basket } from '../../models/basket';
import { Item } from '../../models/item';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css'
})
export class BasketComponent implements OnInit {

  http: HttpClient;
  shouldVoid: boolean = false;
  toBeVoided!: LineItem;

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

  constructor(http: HttpClient) {
    this.http = http;
  }

  ngOnInit(): void {
  }

  public getBasket() {
    return this.basket;
  }

  public updateLocation (location: any) {
    this.basket.location = location.address.Address + ', ' + location.address.City + ', ' + location.address.RegionAbbr;
    return this.basket;
  }

  public addItem(item: Item): Basket {
    if(this.basket.lineItems.length === 0) {
      this.basket.receiptNumber = this.basket.receiptNumber + 1;
    }
      this.basket.lineItems.push({
        item: item,
        quantity: 1,
        voided: false
      });
      this.basket.subTotal = Number((this.basket.subTotal + item.price).toFixed(2));
      this.basket.taxApplied = Number((this.basket.subTotal * 0.07).toFixed(2));
      this.basket.total = Number((this.basket.subTotal + this.basket.taxApplied).toFixed(2));
      return this.basket;
  };

  public clearBasket() {
    this.basket = {
      receiptNumber: this.basket.receiptNumber,
      cashierName: 'Ned Stark',
      cashierId: 1234,
      date: new Date(),
      location: this.basket.location,
      voided: false,
      lineItems: [],
      subTotal: 0,
      taxApplied: 0,
      total: 0,
    };
    return this.basket;
  };

  public voidLineItem() {
    this.toBeVoided.quantity = 0;
    this.toBeVoided.voided = true;
    this.basket.subTotal = Number((this.basket.subTotal - this.toBeVoided.item.price).toFixed(2));
    this.basket.taxApplied = Number((this.basket.subTotal * 0.07).toFixed(2));
    this.basket.total = Number((this.basket.subTotal + this.basket.taxApplied).toFixed(2));
    this.shouldVoid = false;
    return {basket: this.basket, shouldVoid: this.shouldVoid};
  };

  public voidBasket() {
    this.shouldVoid = false;
    this.basket.lineItems.forEach( (lineItem: LineItem) => {
      lineItem.quantity = 0;
      lineItem.voided = true;
    })
    this.basket.voided = true;
    this.basket.subTotal = 0;
    this.basket.taxApplied = 0;
    this.basket.total = 0;
    return {basket: this.basket, toBeVoided: this.toBeVoided, shouldVoid: this.shouldVoid};
  };

  public tender(payment: string) {
    if(payment === 'cash'){
      alert('Exact cash paid. Basket ended.');
    } else if(payment === 'credit') {
      alert('Credit paid. Basket ended.');
    };
    return this.basket;
  }
  
  public captureItemData(lineItem: LineItem) {
    if(lineItem.voided ) {
      return false;
    } else {
      this.toBeVoided = lineItem;
      this.shouldVoid = true;
      return {toBeVoided: this.toBeVoided, shouldVoid: this.shouldVoid}
    }
  };

}
