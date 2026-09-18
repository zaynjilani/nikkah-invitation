import { Component } from '@angular/core';
import { invitation } from '../../config/invitation.config';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  readonly invitation = invitation;
}
