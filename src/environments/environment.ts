/**
 * Runtime environment configuration.
 *
 * googleMapsApiKey is OPTIONAL. The location section works perfectly well
 * without it (it uses a key-less Google Maps embed URL). Only fill this in
 * if you later want to switch to the interactive Google Maps JavaScript API
 * (e.g. for custom markers, directions, or styled maps).
 *
 * IMPORTANT: Never commit a real API key to a public repository.
 * Prefer injecting it at build/deploy time (CI secret, hosting env var,
 * or a gitignored `environment.local.ts`) rather than hardcoding it here.
 */
export const environment = {
  production: false,
  googleMapsApiKey: '' // <-- add your key here only if you need the JS Maps API
};
