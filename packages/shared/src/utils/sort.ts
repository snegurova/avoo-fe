export type SortDirection = 'asc' | 'desc' | null;

export function sortByName<T extends { name?: string | null }>(
  items: T[] | null | undefined,
  direction: SortDirection = null,
) {
  if (!items) return [] as T[];
  if (direction === null) return items;
  return [...items].sort((a, b) => {
    const nameA = a.name ?? '';
    const nameB = b.name ?? '';
    const compareResult = nameA.localeCompare(nameB, undefined, {
      sensitivity: 'base',
      numeric: true,
    });
    return direction === 'asc' ? compareResult : -compareResult;
  });
}

export default sortByName;
