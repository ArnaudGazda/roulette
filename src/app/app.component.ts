import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

import { RouletteComponent } from './roulette/roulette.component';
import { NamesComponent } from './names/names.component';


@Component({
  selector: 'app-root',
  imports: [RouletteComponent, NamesComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Title
  title = 'Le jeu de la roulette';

  // Winner name
  winner = '';

  // List of items
  items: string[] = [];

  // Update list
  update_items(new_items: string[]): void {
    this.items = new_items;
  }

  // Set winner
  set_winner(name: string): void {
    this.winner = name;
  }

  // Reset winner
  reset_winner(): void {
    this.winner = '';
  }
}
