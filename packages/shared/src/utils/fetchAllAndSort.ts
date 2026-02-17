import { sortByName, SortDirection } from './sort';

export type BaseItemsResponse<T> = { data?: { items?: T[] } | null };

export type FetchAllFn<T> = (params?: Record<string, unknown>) => Promise<BaseItemsResponse<T>>;

export async function fetchAllAndSort<T>(
  fetchAll: FetchAllFn<T>,
  nameMapper: (item: T) => string,
  direction: SortDirection,
  limit = 500,
) {
  if (!direction) {
    const empty: T[] = [];
    return empty;
  }

  const resp = await fetchAll({ limit });
  const allItems = resp.data?.items ?? [];
  const withName = allItems.map((item) => ({ ...item, name: nameMapper(item) }));
  const sorted = sortByName(withName, direction);
  return sorted;
}

export default fetchAllAndSort;
