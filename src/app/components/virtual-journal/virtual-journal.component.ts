import { Component, OnDestroy } from '@angular/core';
import { RegisterService } from '../../services/register.service';

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
    private registerService: RegisterService) {
      this._serviceSubscription = this.registerService.handleEvent.subscribe({
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
}
