import { Component, OnDestroy } from '@angular/core';
import { LineItem } from '../../models/line-item';
import { Basket } from '../../models/basket';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-virtual-journal',
  standalone: true,
  imports: [],
  templateUrl: './virtual-journal.component.html',
  styleUrl: './virtual-journal.component.css'
})
export class VirtualJournalComponent implements OnDestroy {
  private _serviceSubscription: any;
  localStorageKey: number = 0

  constructor(
    private eventsService: EventsService) {
      this._serviceSubscription = this.eventsService.handleEvent.subscribe({
        next: (event: any) => {
          this.localStorageKey = this.localStorageKey + 1;
          localStorage.setItem(`${event.message} ${this.localStorageKey}`, JSON.stringify(event.basket));
          console.log(`${event.message}.`, new Date(), event.basket)
        }
      })
  }

  ngOnDestroy(): void {
    this._serviceSubscription.unsubscribe();
  }

  public captureItemData(lineItem: LineItem) {
    this.localStorageKey = this.localStorageKey + 1;
    localStorage.setItem(`Line item selected ${this.localStorageKey}`, JSON.stringify(lineItem))
    console.log('Line item selected.', new Date(), lineItem)
  }
}
