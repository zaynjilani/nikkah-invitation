import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { invitation } from '../../config/invitation.config';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  readonly invitation = invitation;
}
