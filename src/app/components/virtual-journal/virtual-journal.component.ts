import { Component } from '@angular/core';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-virtual-journal',
  standalone: true,
  imports: [],
  templateUrl: './virtual-journal.component.html',
  styleUrl: './virtual-journal.component.css'
})
export class VirtualJournalComponent {
  localStorageKey: number = 0

  constructor(
    private registerService: RegisterService) {
      this.registerService.handleEvent.subscribe({
        next: (event: any) => {
          this.localStorageKey = this.localStorageKey + 1;
          localStorage.setItem(`${event.message} ${this.localStorageKey}`, JSON.stringify(event.basket));
          console.log(`${event.message}.`, new Date(), event.basket)
        }
      })
  }
}
