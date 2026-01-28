export function isEmptyObject(value: unknown): boolean {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value as object).length === 0
  );
}
