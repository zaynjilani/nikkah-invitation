import { Injectable, signal } from '@angular/core';
import { invitation } from '../config/invitation.config';

/**
 * Manages the invitation's background music.
 *
 * - Never autoplays on load (browsers block this anyway; we also want the
 *   "Tap to Open" gesture to be the moment the music begins).
 * - Loops continuously once started.
 * - Fades in smoothly rather than jumping straight to full volume.
 * - Fails silently if playback is blocked/unsupported — the invitation must
 *   keep working with or without sound.
 */
@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private readonly targetVolume = 0.3;
  private readonly fadeDurationMs = 1500;

  private audio: HTMLAudioElement | null = null;
  private fadeHandle: ReturnType<typeof setInterval> | null = null;

  /** Reactive flag components can read (e.g. the floating music control). */
  readonly playing = signal(false);
  /** True once we know playback is unavailable (blocked, missing file, etc). */
  readonly unavailable = signal(false);

  private ensureAudio(): HTMLAudioElement {
    if (!this.audio) {
      const audio = new Audio(invitation.music);
      audio.loop = true;
      audio.volume = 0;
      audio.preload = 'auto';
      audio.addEventListener('error', () => this.unavailable.set(true));
      this.audio = audio;
    }
    return this.audio;
  }

  async play(): Promise<void> {
    const audio = this.ensureAudio();
    try {
      await audio.play();
      this.playing.set(true);
      this.fadeTo(this.targetVolume);
    } catch (error) {
      // Playback blocked by the browser (or file missing) — invitation
      // continues normally without music.
      console.warn('Nikkah invitation: background music could not start.', error);
      this.playing.set(false);
      this.unavailable.set(true);
    }
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.playing.set(false);
    this.clearFade();
  }

  toggle(): void {
    if (this.playing()) {
      this.pause();
    } else {
      void this.play();
    }
  }

  private fadeTo(target: number): void {
    if (!this.audio) return;
    this.clearFade();
    const steps = 20;
    const stepTime = this.fadeDurationMs / steps;
    const startVolume = this.audio.volume;
    const increment = (target - startVolume) / steps;
    let currentStep = 0;

    this.fadeHandle = setInterval(() => {
      if (!this.audio) {
        this.clearFade();
        return;
      }
      currentStep++;
      const next = startVolume + increment * currentStep;
      this.audio.volume = Math.min(Math.max(next, 0), 1);
      if (currentStep >= steps) {
        this.clearFade();
      }
    }, stepTime);
  }

  private clearFade(): void {
    if (this.fadeHandle !== null) {
      clearInterval(this.fadeHandle);
      this.fadeHandle = null;
    }
  }
}
