import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PosComponent } from './components/pos/pos.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PosComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'POS-Project';
}
