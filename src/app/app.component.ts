import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvitationDoorComponent } from './components/invitation-door/invitation-door.component';
import { CurtainTransitionComponent } from './components/curtain-transition/curtain-transition.component';
import { HeroComponent } from './components/hero/hero.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ScratchRevealComponent } from './components/scratch-reveal/scratch-reveal.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { LocationComponent } from './components/location/location.component';
import { FooterComponent } from './components/footer/footer.component';
import { MusicControlComponent } from './components/music-control/music-control.component';
import { MusicService } from './services/music.service';

type OpeningStage = 'door' | 'curtain' | 'revealed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    InvitationDoorComponent,
    CurtainTransitionComponent,
    HeroComponent,
    WelcomeComponent,
    ScratchRevealComponent,
    CountdownComponent,
    LocationComponent,
    FooterComponent,
    MusicControlComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  stage: OpeningStage = 'door';

  constructor(private readonly music: MusicService) {
    // Scrolling is disabled until the door + curtain sequence finishes.
    document.body.classList.add('no-scroll');
  }

  /** Fired by the door once its opening animation completes. */
  onDoorOpened(): void {
    // This click is the user gesture — start music now so mobile browsers allow it.
    void this.music.play();
    this.stage = 'curtain';
  }

  /** Fired by the curtain once it has fully opened. */
  onCurtainOpened(): void {
    this.stage = 'revealed';
    document.body.classList.remove('no-scroll');
  }

  get contentVisible(): boolean {
    return this.stage === 'revealed';
  }
}
