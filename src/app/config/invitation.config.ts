export interface VenueConfig {
  name: string;
  address: string;
  /** Set to a real latitude to enable the embedded map. Leave at 0 for a placeholder. */
  latitude: number;
  /** Set to a real longitude to enable the embedded map. Leave at 0 for a placeholder. */
  longitude: number;
}

export interface InvitationConfig {
  groom: string;
  bride: string;
  event: string;
  /** Human-readable date, e.g. "25th September 2026" */
  date: string;
  /** Human-readable time, e.g. "8:00 PM" */
  time: string;
  /** ISO 8601 datetime used for the live countdown calculation */
  eventDate: string;
  /** Path to the background music file, relative to /src/assets */
  music: string;
  welcomeMessage: string;
  welcomeSubMessage: string;
  closingMessage: string;
  venue: VenueConfig;
}

/**
 * Single source of truth for all wedding details.
 * Update this object to change anything shown across the site.
 */
export const invitation: InvitationConfig = {
  groom: 'Syed Zain Ahmed Jilani',
  bride: 'Marium Nasim',
  event: 'Nikkah Ceremony',
  date: '25th September 2026',
  time: '8:00 PM',

  // Used for the live countdown — keep this in sync with `date` / `time` above.
  eventDate: '2026-09-25T20:00:00',

  music: 'assets/audio/nikkah-music.mp3',

  welcomeMessage:
    'With the blessings of Allah, we are honored to invite you to celebrate the beginning of a beautiful new chapter as two hearts come together in Nikkah.',
  welcomeSubMessage:
    'Your presence and duas will make this blessed occasion even more meaningful to us.',

  closingMessage: 'We look forward to celebrating this blessed occasion with you.',

  venue: {
    name: 'Nikkah Ceremony',
    address: 'B, 104, Sector 11-A Sector 11 A North Karachi, l, Pakistan',
    latitude: 0,
    longitude: 0
  }
};
