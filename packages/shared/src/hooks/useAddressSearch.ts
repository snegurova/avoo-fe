import { useCallback, useState } from 'react';
import type { NominatimPlace } from '../types/geocode';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@avoo/axios/src/apiClient';
import { useApiStatusStore } from '@avoo/store';

type MyLocationResult = {
  place: NominatimPlace | null;
  coords?: { latitude: number; longitude: number };
};

type GeoPosition = { coords: { latitude: number; longitude: number } };

async function fetchJson<T = unknown>(url: string): Promise<T | null> {
  const res = await apiClient.get(url).catch(() => null);
  if (!res) return null;
  return (res.data as T) ?? null;
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
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&accept-language=${encodeURIComponent(
        lang,
      )}&q=${encodeURIComponent(currentQuery)}`;
      return fetchJson<NominatimPlace[]>(url);
    },
    enabled: false,
  });

  const search = useCallback(
    async (query: string) => {
      if (!query) return;
      setIsPending(true);
      setCurrentQuery(query);
      try {
        await queryClient.fetchQuery({
          queryKey: ['addressSearch', query],
          queryFn: async () => {
            const lang = getLang();
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&accept-language=${encodeURIComponent(
              lang,
            )}&q=${encodeURIComponent(query)}`;
            return fetchJson<NominatimPlace[]>(url);
          },
        });
      } finally {
        setIsPending(false);
      }
    },
    [queryClient, setIsPending, setCurrentQuery],
  );

  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      setIsPending(true);
      try {
        const res = await queryClient.fetchQuery({
          queryKey: ['reverseGeocode', latitude, longitude],
          queryFn: async () => {
            const lang = getLang();
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&accept-language=${encodeURIComponent(
              lang,
            )}&lat=${latitude}&lon=${longitude}`;
            return fetchJson<NominatimPlace>(url);
          },
        });
        return res;
      } finally {
        setIsPending(false);
      }
    },
    [queryClient, setIsPending],
  );

  const getMyLocation = useCallback(async (): Promise<MyLocationResult> => {
    if (!navigator?.geolocation) return { place: null };
    setIsPending(true);
    try {
      const pos = await new Promise<GeoPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject),
      );
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;
      const place = await reverseGeocode(latitude, longitude);
      return { place, coords: { latitude, longitude } };
    } catch {
      return { place: null };
    } finally {
      setIsPending(false);
    }
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
