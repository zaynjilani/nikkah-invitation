import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { invitation } from '../../config/invitation.config';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent implements OnInit, OnDestroy {
  readonly invitation = invitation;

  countdown: Countdown = { days: '00', hours: '00', minutes: '00', seconds: '00' };
  hasArrived = false;

  /** Tracks which unit last changed, so the template can trigger a flip animation. */
  changedUnit: keyof Countdown | null = null;

  private intervalId?: ReturnType<typeof setInterval>;
  private readonly targetTime = new Date(invitation.eventDate).getTime();

  ngOnInit(): void {
    this.tick();
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private tick(): void {
    const now = Date.now();
    const diff = this.targetTime - now;

    if (diff <= 0) {
      this.hasArrived = true;
      if (this.intervalId) clearInterval(this.intervalId);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const next: Countdown = {
      days: this.pad(days),
      hours: this.pad(hours),
      minutes: this.pad(minutes),
      seconds: this.pad(seconds)
    };

    this.changedUnit = this.diffKey(next);
    this.countdown = next;
  }

  private diffKey(next: Countdown): keyof Countdown | null {
    if (next.seconds !== this.countdown.seconds) return 'seconds';
    return null;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
