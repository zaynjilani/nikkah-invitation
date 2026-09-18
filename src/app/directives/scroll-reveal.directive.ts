import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

/**
 * Adds a "reveal-visible" class to the host element the first time it enters
 * the viewport, triggering a subtle fade/translate CSS transition.
 * Respects prefers-reduced-motion by revealing content immediately.
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay = 0;

  private observer?: IntersectionObserver;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    this.renderer.addClass(host, 'reveal-init');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      this.renderer.addClass(host, 'reveal-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => this.renderer.addClass(host, 'reveal-visible'), this.revealDelay);
            this.observer?.unobserve(host);
          }
        }
      },
      { threshold: 0.2 }
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
