export function isEmptyObject(value: unknown): boolean {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  );
}

/** True when selection is "all" — none selected (no filter) or all selected (full set). */
export function isFullSelection(selectedCount: number, totalCount: number): boolean {
  return selectedCount === 0 || selectedCount === totalCount;
}
