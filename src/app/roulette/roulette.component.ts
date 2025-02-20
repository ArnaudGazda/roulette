import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

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
  imports: [],
  templateUrl: './roulette.component.html',
  styleUrl: './roulette.component.css'
})
export class RouletteComponent implements OnInit {
  // Canvas reference
  @ViewChild("canvas", {static: true}) canvas!: ElementRef<HTMLCanvasElement>;

  // Read only color
  readonly stroke_color = '#485D6C';

  // Roulette objects
  items = ["Joueur 1", "Joueur 2", "Joueur 3", "Joueur 4", "Joueur 5", "Joueur 6",
           "Joueur 1", "Joueur 2", "Joueur 3", "Joueur 4", "Joueur 5", "Joueur 6"];

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
    const angle = 2 * Math.PI / this.items.length;

    // Draw roulette
    // To fix supperposition issues, the roulette content is displayed first
    let offset = -(Math.PI / 2 + angle / 2);

    for (const [index, _] of this.items.entries()) {
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
}
