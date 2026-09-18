import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-curtain-transition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curtain-transition.component.html',
  styleUrl: './curtain-transition.component.scss'
})
export class CurtainTransitionComponent implements OnInit {
  @Output() curtainOpened = new EventEmitter<void>();

  isOpening = false;

  ngOnInit(): void {
    // Small delay so the curtain is visible closed for a beat before parting,
    // giving the transition a deliberate, cinematic feel.
    setTimeout(() => (this.isOpening = true), 200);
    // Matches the curtain transition duration in SCSS (1.4s) + the initial delay.
    setTimeout(() => this.curtainOpened.emit(), 1700);
  }
}
