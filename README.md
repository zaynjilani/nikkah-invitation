# Nikkah Invitation — Syed Zain Ahmed Jilani & Marium Nasim

A premium, fully responsive Angular (standalone components) digital Nikkah
invitation with a cinematic door → curtain opening, background music,
scroll animations, an interactive scratch-to-reveal, a live countdown, and a
configurable venue/map section.

---

## 1. Requirements

- Node.js 18+ (LTS recommended)
- npm 9+
- Angular CLI 17 (`npm install -g @angular/cli` — optional, `npx` also works)

## 2. Install & Run

```bash
npm install
npm start        # ng serve — opens on http://localhost:4200
```

> **If you previously ran `npm install` and hit a peer-dependency error**
> mentioning `@angular-devkit/build-angular` wanting a newer TypeScript
> (e.g. resolving to a `21.x` build-angular instead of `17.3.x`), your
> `node_modules`/`package-lock.json` picked up a mismatched version.
> Fix it with a clean reinstall:
> ```bash
> rm -rf node_modules package-lock.json
> npm install
> ```
> This project's `package.json` now pins exact, mutually-tested versions
> (Angular 17.3.12 + TypeScript 5.4.5) rather than caret ranges, so a
> clean install will not pull in a newer, incompatible major version.

Production build:

```bash
npm run build     # outputs to dist/nikkah-invitation
```

Deploy the contents of `dist/nikkah-invitation` to any static host
(Netlify, Vercel, Firebase Hosting, GitHub Pages, S3, etc.) — this is a
single static site with no backend.

---

## 3. Customizing the Wedding Details

Everything shown on the site — names, event, date/time, countdown target,
welcome messages, closing message, and venue — is centralized in:

```
src/app/config/invitation.config.ts
```

Edit the `invitation` object there. No other files need to change. For
example, to move the date, update **both**:

```ts
date: '25th September 2026',       // what visitors read
eventDate: '2026-09-25T20:00:00',  // what the countdown calculates against
```

## 4. Adding the Background Music

Drop your licensed/royalty-free MP3 at:

```
src/assets/audio/nikkah-music.mp3
```

See `src/assets/audio/README.md` for guidance on where to source
royalty-free music. No code changes are required — the `MusicService`
reads the path from `invitation.config.ts` (`music` field).

**Do not use copyrighted commercial music without a license.**

Behavior implemented, per the brief:
- Music does **not** autoplay on load.
- Music starts the moment the visitor taps **"Tap to Open"** (a genuine
  user gesture, so mobile browsers allow it).
- Fades in smoothly over ~1.5s to ~30% volume, then loops continuously.
- Keeps playing uninterrupted through scrolling, countdown ticks, and the
  location section.
- A floating circular control (bottom-right) toggles play/pause and is
  fully keyboard accessible.
- If playback is blocked or the file is missing, the site keeps working
  normally — failure is caught and logged, never thrown.

## 5. Setting the Venue / Map

Edit the `venue` object in `invitation.config.ts`:

```ts
venue: {
  name: 'Nikkah Ceremony',
  address: '123 Garden Avenue, Karachi, Pakistan',
  latitude: 24.8607,
  longitude: 67.0011
}
```

- If you provide `latitude`/`longitude` (non-zero) **or** a real
  `address` (i.e. not the literal placeholder text), the site
  automatically shows a live, responsive Google Maps embed and a
  **"View Location"** button that opens turn-by-turn directions.
- If neither is set, a tasteful map placeholder is shown instead of a
  broken/invalid map.

### About the Google Maps API key

The map embed used here (`https://www.google.com/maps?q=...&output=embed`)
requires **no API key** — it's Google's key-less embed endpoint, so the
key is never exposed in the source code.

If you later want the full interactive Google Maps **JavaScript API**
(custom markers, styled maps, etc.), an `environment.googleMapsApiKey`
field is already scaffolded at:

```
src/environments/environment.ts
```

Add your key there only if you upgrade to the JS API, and keep that file
out of public version control (or inject the key via your hosting
provider's environment variables / CI secrets at build time) — never
commit a real key to a public repository.

## 6. Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── invitation-door/       Front door + "Tap to Open"
│   │   ├── curtain-transition/    Curtain opening animation
│   │   ├── hero/                  Couple names & event hero
│   │   ├── welcome/                Heartfelt invitation message
│   │   ├── scratch-reveal/        Canvas scratch-off interaction
│   │   ├── countdown/             Live countdown to the Nikkah
│   │   ├── location/              Venue + map + directions
│   │   ├── music-control/         Floating play/pause control
│   │   └── footer/                Closing message
│   ├── directives/
│   │   └── scroll-reveal.directive.ts   Fade-up on scroll (IntersectionObserver)
│   ├── services/
│   │   └── music.service.ts       Background audio (fade-in, loop, toggle)
│   ├── config/
│   │   └── invitation.config.ts   ⭐ single source of truth for all details
│   ├── app.component.ts/html/scss Orchestrates door → curtain → content
│   └── app.config.ts
├── assets/
│   ├── audio/nikkah-music.mp3     ⭐ add your music file here
│   ├── images/
│   └── fonts/
└── styles.scss                    Design tokens (palette, fonts, reveal classes)
```

## 7. Accessibility Notes

- The "Tap to Open" button and the music control are real `<button>`
  elements, reachable and operable via keyboard (Enter/Space) with
  visible focus rings.
- Countdown numbers are in a `role="timer"` / `aria-live="polite"` region.
- All decorative glyphs/ornaments use `aria-hidden="true"`.
- `prefers-reduced-motion: reduce` disables/shortens non-essential
  animations sitewide (pulsing ring, scroll cue, scratch fade, etc.).

## 8. Performance Notes

- Pure CSS transitions/animations are used wherever possible (door,
  curtain, hover states) instead of JS animation loops.
- Scroll-triggered fades use `IntersectionObserver`, not scroll-event
  polling.
- The scratch canvas samples a coarse pixel grid (not every pixel) to
  check scratch coverage, and cancels its RAF fade loop on destroy.
- All `setInterval`/`setTimeout`/`ResizeObserver`/`IntersectionObserver`
  usage is cleaned up in `ngOnDestroy` to avoid memory leaks.
- No large third-party UI libraries — just Angular, RxJS-free reactive
  signals for music state, and the platform Canvas/Audio APIs.

## 9. Browser Support Notes

- Uses `pointerdown`/`pointermove`/`pointerup` for the scratch
  interaction, which unifies mouse, trackpad, and touch input in modern
  browsers (Chrome, Safari, Firefox, Edge, iOS Safari, Android Chrome).
- `100dvh` is used for full-height sections to behave correctly on
  mobile browsers with dynamic toolbars.
