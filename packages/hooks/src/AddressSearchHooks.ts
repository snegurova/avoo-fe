import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@avoo/axios/src/apiClient';
import { useApiStatusStore } from '@avoo/store';
import { NominatimPlace } from '@avoo/shared';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const SEARCH_PATH = '/search';
const REVERSE_PATH = '/reverse';
const DEFAULT_SEARCH_LIMIT = 5;

function buildSearchUrl(query: string, lang: string, limit = DEFAULT_SEARCH_LIMIT) {
  return `${NOMINATIM_BASE}${SEARCH_PATH}?format=json&limit=${limit}&addressdetails=1&accept-language=${encodeURIComponent(
    lang,
  )}&q=${encodeURIComponent(query)}`;
}

function buildReverseUrl(lat: number, lon: number, lang: string) {
  return `${NOMINATIM_BASE}${REVERSE_PATH}?format=json&addressdetails=1&accept-language=${encodeURIComponent(
    lang,
  )}&lat=${lat}&lon=${lon}`;
}

type MyLocationResult = {
  place: NominatimPlace | null;
  coords?: { latitude: number; longitude: number };
};

type GeoPosition = { coords: { latitude: number; longitude: number } };

async function fetchJson<T = unknown>(url: string): Promise<T | null> {
  return apiClient
    .get<T>(url)
    .then((res) => res.data ?? null)
    .catch(() => null);
}

export function useAddressSearch() {
  const queryClient = useQueryClient();
  const setIsPending = useApiStatusStore((s) => s.setIsPending);

  const [currentQuery, setCurrentQuery] = useState<string | null>(null);

  const getLang = () =>
    typeof navigator !== 'undefined' && navigator.language
      ? navigator.language.split('-')[0]
      : 'en';

  const searchQuery = useQuery<NominatimPlace[] | null>({
    queryKey: ['addressSearch', currentQuery],
    queryFn: async () => {
      if (!currentQuery) return null;
      const lang = getLang();
      const url = buildSearchUrl(currentQuery, lang);
      return fetchJson<NominatimPlace[]>(url);
    },
    enabled: false,
  });

  const search = useCallback(
    async (query: string) => {
      if (!query) return;
      setIsPending(true);
      setCurrentQuery(query);
      return queryClient
        .fetchQuery({
          queryKey: ['addressSearch', query],
          queryFn: async () => {
            const lang = getLang();
            const url = buildSearchUrl(query, lang);
            return fetchJson<NominatimPlace[]>(url);
          },
        })
        .finally(() => setIsPending(false));
    },
    [queryClient, setIsPending, setCurrentQuery],
  );

  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      setIsPending(true);
      return queryClient
        .fetchQuery({
          queryKey: ['reverseGeocode', latitude, longitude],
          queryFn: async () => {
            const lang = getLang();
            const url = buildReverseUrl(latitude, longitude, lang);
            return fetchJson<NominatimPlace>(url);
          },
        })
        .finally(() => setIsPending(false));
    },
    [queryClient, setIsPending],
  );

  const getMyLocation = useCallback((): Promise<MyLocationResult> => {
    if (!navigator?.geolocation) return Promise.resolve({ place: null });
    setIsPending(true);
    return new Promise<GeoPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject),
    )
      .then((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        return reverseGeocode(latitude, longitude).then((place) => ({
          place,
          coords: { latitude, longitude },
        }));
      })
      .catch(() => ({ place: null }))
      .finally(() => setIsPending(false));
  }, [reverseGeocode, setIsPending]);

  const clear = useCallback(() => {
    setCurrentQuery(null);
    queryClient.removeQueries({ queryKey: ['addressSearch'] });
  }, [queryClient]);

  return {
    search,
    searchResults: searchQuery.data ?? null,
    isSearching: searchQuery.isFetching || searchQuery.isLoading,
    clear,
    reverseGeocode,
    getMyLocation,
  } as const;
}
