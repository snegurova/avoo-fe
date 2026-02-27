export function isEmptyObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.keys(value).length === 0;
}

/** True when selection is "all" — none selected (no filter) or all selected (full set). */
export function isFullSelection(selectedCount: number, totalCount: number): boolean {
  return selectedCount === 0 || selectedCount === totalCount;
}
