import { FieldErrors, FieldError, FieldValues } from 'react-hook-form';

function hasMessage(x: unknown): x is FieldError {
  return typeof x === 'object' && x !== null && 'message' in x;
}

export function getAllErrorMessages<T extends FieldValues>(
  obj: FieldErrors<T>,
  list: string[] = [],
): string[] {
  if (!obj) return list;

  for (const key of Object.keys(obj)) {
    const val: unknown = obj[key];

    if (!val) continue;
    if (hasMessage(val) && typeof val.message === 'string') {
      list.push(val.message);
    }

    if (typeof val === 'object' && val !== null) {
      getAllErrorMessages(val as FieldErrors<T>, list);
    }
  }

  return list;
}
