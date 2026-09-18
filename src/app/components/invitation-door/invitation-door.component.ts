import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { invitation } from '../../config/invitation.config';

@Component({
  selector: 'app-invitation-door',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invitation-door.component.html',
  styleUrl: './invitation-door.component.scss'
})
export class InvitationDoorComponent {
  @Output() opened = new EventEmitter<void>();

  readonly invitation = invitation;
  isOpening = false;

  handleOpen(): void {
    if (this.isOpening) return;
    this.isOpening = true;
    // Matches the door panel transition duration defined in SCSS (1.3s),
    // plus a short pause so the motion reads as deliberate, not abrupt.
    setTimeout(() => this.opened.emit(), 1300);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleOpen();
    }
  }
}
