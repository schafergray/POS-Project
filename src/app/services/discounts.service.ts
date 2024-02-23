import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Basket } from '../models/basket';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  private apiUrl = 'http://localhost:80';

  constructor(private http: HttpClient) {}

  public checkForDiscounts(basket: Basket): Observable<any> {
    return this.http.post(`${this.apiUrl}/discounts`, basket, {responseType: 'text'});
  }
}
