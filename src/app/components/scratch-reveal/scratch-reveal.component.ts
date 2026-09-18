import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { invitation } from '../../config/invitation.config';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-scratch-reveal',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './scratch-reveal.component.html',
  styleUrl: './scratch-reveal.component.scss'
})
export class ScratchRevealComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scratchCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stage') stageRef!: ElementRef<HTMLDivElement>;

  readonly invitation = invitation;

  revealed = false;

  private ctx!: CanvasRenderingContext2D;
  private isScratching = false;
  private lastPoint: { x: number; y: number } | null = null;
  private resizeObserver?: ResizeObserver;
  private fadeRAF?: number;

  /** Threshold in the 50–60% range requested. */
  private readonly clearThreshold = 0.55;
  private readonly reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngAfterViewInit(): void {
    this.setupCanvas();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        if (!this.revealed) this.setupCanvas();
      });
      this.resizeObserver.observe(this.stageRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.fadeRAF) cancelAnimationFrame(this.fadeRAF);
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const stage = this.stageRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = stage.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    this.ctx = ctx;

    this.paintScratchLayer(rect.width, rect.height);
  }

  private paintScratchLayer(width: number, height: number): void {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // Luxurious champagne/gold gradient "foil" layer.
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#efe3cc');
    gradient.addColorStop(0.5, '#d8c3a5');
    gradient.addColorStop(1, '#c7ac82');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle texture strokes for a premium foil feel.
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width + height; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(0, i);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(63,64,56,0.65)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 0.95rem "Cinzel", serif';
    ctx.fillText('SCRATCH HERE', width / 2, height / 2);
  }

  private getRelativePoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  private scratchAt(x: number, y: number): void {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    if (this.lastPoint) {
      ctx.lineWidth = 42;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    this.lastPoint = { x, y };
  }

  private checkScratchedPercentage(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    // Sampling a coarse grid rather than every pixel keeps this cheap.
    const sampleStep = 8 * dpr;
    const { width, height } = canvas;
    const imageData = this.ctx.getImageData(0, 0, width, height).data;

    let transparent = 0;
    let total = 0;
    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const index = (y * width + x) * 4 + 3; // alpha channel
        if (imageData[index] < 20) transparent++;
        total++;
      }
    }

    if (total > 0 && transparent / total >= this.clearThreshold) {
      this.revealRemaining();
    }
  }

  private revealRemaining(): void {
    if (this.revealed) return;
    this.revealed = true;

    if (this.reducedMotion) {
      this.canvasRef.nativeElement.style.display = 'none';
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    let opacity = 1;
    const step = () => {
      opacity -= 0.05;
      canvas.style.opacity = Math.max(opacity, 0).toString();
      if (opacity > 0) {
        this.fadeRAF = requestAnimationFrame(step);
      } else {
        canvas.style.display = 'none';
      }
    };
    this.fadeRAF = requestAnimationFrame(step);
  }

  // --- Pointer / touch event handlers -------------------------------------

  onPointerDown(event: PointerEvent): void {
    if (this.revealed) return;
    this.isScratching = true;
    const { x, y } = this.getRelativePoint(event.clientX, event.clientY);
    this.scratchAt(x, y);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isScratching || this.revealed) return;
    const { x, y } = this.getRelativePoint(event.clientX, event.clientY);
    this.scratchAt(x, y);
  }

  @HostListener('window:pointerup')
  @HostListener('window:pointercancel')
  onPointerUp(): void {
    if (!this.isScratching) return;
    this.isScratching = false;
    this.lastPoint = null;
    this.checkScratchedPercentage();
  }
}
