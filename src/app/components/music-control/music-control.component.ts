import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-music-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-control.component.html',
  styleUrl: './music-control.component.scss'
})
export class MusicControlComponent {
  constructor(readonly music: MusicService) {}

  toggle(): void {
    this.music.toggle();
  }
}
