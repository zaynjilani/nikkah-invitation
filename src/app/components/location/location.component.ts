import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { invitation } from '../../config/invitation.config';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  readonly invitation = invitation;

  readonly hasCoordinates =
    invitation.venue.latitude !== 0 || invitation.venue.longitude !== 0;
  readonly hasAddress = invitation.venue.address !== 'ADD VENUE ADDRESS HERE';
  readonly mapConfigured = this.hasCoordinates || this.hasAddress;

  readonly mapEmbedUrl: SafeResourceUrl | null;
  readonly directionsUrl: string;

  constructor(private readonly sanitizer: DomSanitizer) {
    const { latitude, longitude, address } = invitation.venue;

    // Key-less Google Maps embed: works out of the box for a quick, tasteful
    // map without requiring any API key or billing setup.
    const query = this.hasCoordinates ? `${latitude},${longitude}` : encodeURIComponent(address);

    this.mapEmbedUrl = this.mapConfigured
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.google.com/maps?q=${query}&output=embed`
        )
      : null;

    this.directionsUrl = this.hasCoordinates
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }
}
