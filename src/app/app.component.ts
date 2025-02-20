import { Component } from '@angular/core';
import { RouletteComponent } from './roulette/roulette.component';
import { NamesComponent } from './names/names.component';


@Component({
  selector: 'app-root',
  imports: [RouletteComponent, NamesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Le jeu de la roulette';
}
