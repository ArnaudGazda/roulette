import { Component, output } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';

import { colors } from '../colors';


@Component({
  selector: 'app-names',
  imports: [NgFor, NgStyle],
  templateUrl: './names.component.html',
  styleUrl: './names.component.css'
})
export class NamesComponent {
  // List of items
  items: string[] = [];
  update = output<string[]>();

  // Add item
  add_item(event: Event): void {
    // Add name
    const name = (event.target as HTMLInputElement).value
    this.items.push(name);

    // Clear input
    (event.target as HTMLInputElement).value = "";

    // Emit event
    this.emit_change();
  }

  // Background color
  background(index: number): Record<string, string> {
    // Get color
    const background_color = colors[index % colors.length];

    // CSS style
    return {
      "background": background_color
    };
  }

  // Delete item
  delete_item(index: number): void {
    // Remove item
    this.items.splice(index, 1);

    // Emit event
    this.emit_change();
  }

  // Emit change
  emit_change(): void {
    this.update.emit(this.items);
  }
}
