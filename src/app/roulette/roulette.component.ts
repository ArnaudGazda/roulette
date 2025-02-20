import { Component, ViewChild, ElementRef, OnInit, Input, output } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';

import { colors } from '../colors';


/**
 * Compute the inverse color
 * Given an hexadecimal color, compute the opposite color
 */
function inverse_color(color: string): string {
  // Decode color
  const decoded = /#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/.exec(color);

  if (decoded === null || decoded.length < 4) {
    return '#000000';
  }

  const red = parseInt(decoded[1], 16);
  const green = parseInt(decoded[2], 16);
  const blue = parseInt(decoded[3], 16);

  // Inverse color
  const new_red = (255 - red).toString(16).padStart(2, '0');
  const new_green = (255 - green).toString(16).padStart(2, '0');
  const new_blue = (255 - blue).toString(16).padStart(2, '0');

  return `#${new_red}${new_green}${new_blue}`;
}



@Component({
  selector: 'app-roulette',
  imports: [NgIf, NgStyle],
  templateUrl: './roulette.component.html',
  styleUrl: './roulette.component.css'
})
export class RouletteComponent implements OnInit {
  // Canvas reference
  @ViewChild("canvas", {static: true}) canvas!: ElementRef<HTMLCanvasElement>;

  // Read only color & duration
  readonly stroke_color = '#485D6C';
  readonly spin_duration = 5; // In seconds

  // Emit winner name
  winner = output<string>();

  // Roulette objects
  items: string[] = [];
  spin_count = 0;
  spin_visible = true;

  selected_index: number | null = null;

  ngOnInit() {
    // Create lobster font
    const font = new FontFace(
      "Lobster",
      "url(https://fonts.gstatic.com/s/lobster/v30/neILzCirqoswsqX9zoKmMw.woff2)",
      { style: "normal", weight: "400" }
    );

    // Download it
    font.load().then(() => {
      document.fonts.add(font);

      this.refresh_canvas();
    });
  }

  @Input()
  set values(new_items: string[]) {
    this.items = new_items;

    // Reset spint
    this.spin_count = 0;
    this.spin_visible = true;
    this.selected_index = null;

    // Update canvas
    this.refresh_canvas();
  }

  // Get angle of one item
  get_angle(): number {
    return 2 * Math.PI / this.items.length;
  }

  // Draw canvas
  refresh_canvas(): void {
    // Get canvas and context
    const canvas_element = (this.canvas.nativeElement as HTMLCanvasElement);
    const context = canvas_element.getContext('2d');

    if (context === null) {
      console.warn("Could not create 2D context - no roulette");
      return;
    }

    context.clearRect(0, 0, canvas_element.width, canvas_element.height);

    // Get constants
    const x_center = canvas_element.width / 2;
    const y_center = canvas_element.height / 2;
    const radius = Math.min(x_center,  y_center) - 5;
    const angle = this.get_angle();

    // Edge case - avoid empty list error
    if (this.items.length === 0) {
      // Draw circle
      context.beginPath();
      context.arc(x_center, y_center, radius, 0, 2 * Math.PI, false);

      // Set shape
      context.fillStyle = "#ECECEC";
      context.fill();

      context.strokeStyle = this.stroke_color;
      context.lineWidth = 5;
      context.stroke();

      return;
    }

    // Draw roulette
    // To fix supperposition issues, the roulette content is displayed first
    let offset = -(Math.PI / 2 + angle / 2);

    for (const index of this.items.keys()) {
      // Draw zone
      context.beginPath();
      context.moveTo(x_center, y_center);
      context.lineTo(x_center + radius * Math.cos(offset), y_center + radius * Math.sin(offset));
      context.arc(x_center, y_center, radius, offset, offset + angle, false);

      // Shape color
      context.fillStyle = colors[index % colors.length];
      context.fill();

      // Zone
      offset += angle;
    }

    for (const [index, item] of this.items.entries()) {
      // Draw zone
      context.beginPath();
      context.moveTo(x_center, y_center);
      context.lineTo(x_center + radius * Math.cos(offset), y_center + radius * Math.sin(offset));
      context.arc(x_center, y_center, radius, offset, offset + angle, false);

      // Shape border
      context.strokeStyle = this.stroke_color;
      context.lineWidth = 5;
      context.stroke();

      // Draw name
      context.save();
      context.translate(x_center, y_center);
      context.rotate(offset + angle / 2);
      context.translate(0, 7);
      context.fillStyle = inverse_color(colors[index % colors.length]);
      context.font = "30px 'Lobster'";
      context.fillText(item, 100, 0, radius - 100);
      context.restore();

      // Next zone
      offset += angle;
    }
  }

  // Start spin
  spin(): void {
    this.selected_index = Math.floor(Math.random() * this.items.length);
    this.spin_visible = false;
    this.spin_count += 1;

    setTimeout(
        () => {
          this.spin_visible = true;

          if (this.selected_index !== null)
            this.winner.emit(this.items[this.selected_index]);
        },
        (this.spin_duration + 1) * 1000
    );
  }

  // Perform rotation
  rotate(): Record<string, string> {
    // No spin if no index
    if (this.selected_index === null) {
      return {};
    }

    // Spin because index
    const angle = this.spin_count * 20 * Math.PI - this.selected_index * this.get_angle();

    return {
      "transform": `rotate(${angle}rad)`,
      "transition": `${this.spin_duration}s`
    };
  }
}
