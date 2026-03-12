import { useState } from 'react';

type SortDirection = 'asc' | 'desc';

export function useSort<T extends string>(
  initialField: T,
  initialDirection: SortDirection = 'asc',
) {
  const [field, setField] = useState<T>(initialField);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const onSortClick = (clickedField: T) => {
    if (field === clickedField) {
      setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setField(clickedField);
      setDirection('asc');
    }
  };

  const sortQuery = `${field}:${direction}` as `${T}:${SortDirection}`;

  return {
    field,
    direction,
    sortQuery,
    onSortClick,
  };
}
