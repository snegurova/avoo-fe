import type { VisualProfileInfo } from '@avoo/shared';
import type { UpdateProfile } from '@avoo/axios/types/apiTypes';

export function createProfileDefaults(initial?: VisualProfileInfo | null) {
  return {
    name: initial?.name ?? '',
    phone: initial?.phone ?? '',
    address: initial?.address ?? '',
    location_lat: initial?.location_lat ?? undefined,
    location_lon: initial?.location_lon ?? undefined,
    description: initial?.description ?? '',
  } as const;
}

export function buildUpdateProfilePayload(values: Record<string, unknown>): UpdateProfile {
  const parsedValues = values as {
    name?: string;
    phone?: string;
    description?: string;
    address?: string;
    location_lat?: number;
    location_lon?: number;
  };

  return {
    name: parsedValues.name || undefined,
    phone: parsedValues.phone || undefined,
    mediaIds: [],
    description: parsedValues.description || undefined,
    address: parsedValues.address || undefined,
    location_lat:
      typeof parsedValues.location_lat === 'number' && !Number.isNaN(parsedValues.location_lat)
        ? parsedValues.location_lat
        : undefined,
    location_lon:
      typeof parsedValues.location_lon === 'number' && !Number.isNaN(parsedValues.location_lon)
        ? parsedValues.location_lon
        : undefined,
  };
}

export default function useProfileHelpers() {
  return {
    createProfileDefaults,
    buildUpdateProfilePayload,
  };
}
