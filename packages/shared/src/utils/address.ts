import type { NominatimPlace } from '../types/geocode';
import { buildShortAddress } from './formatAddress';

export function getCondensedAddress(
  place?: NominatimPlace | null,
  fallback?: () => string,
): string {
  if (!place) return fallback ? fallback() : '';
  const short = buildShortAddress(place);
  if (short && short.length > 0) return short;
  if (place.display_name) return place.display_name.split(',').slice(0, 3).join(',');
  return fallback ? fallback() : '';
}
