import { useController, Control, FieldValues, Path } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { VALID_LANGUAGE_CODES, LANGUAGE_NAMES, type LanguageCode } from '@avoo/constants';

function isLanguageCode(code: unknown): code is LanguageCode {
  return typeof code === 'string' && code in LANGUAGE_NAMES;
}

export function useLanguagePicker<T extends FieldValues>(control: Control<T>, name: Path<T>) {
  const { field } = useController({ name, control });

  const [queryParams, setQueryParams] = useState('');

  const selected = useMemo<LanguageCode[]>(() => {
    const raw = field.value;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isLanguageCode);
  }, [field.value]);

  const filtered = useMemo(() => {
    if (!queryParams) {
      const empty: LanguageCode[] = [];
      return empty;
    }
    const normalizedQuery = queryParams.toLowerCase();
    return VALID_LANGUAGE_CODES.filter((code) => {
      const langName = LANGUAGE_NAMES[code].toLowerCase();
      const codeLower = code.toLowerCase();
      return (
        (langName.includes(normalizedQuery) || codeLower.includes(normalizedQuery)) &&
        !selected.includes(code)
      );
    });
  }, [queryParams, selected]);

  const add = useMemo(
    () => (code: LanguageCode) => {
      if (!selected.includes(code)) {
        field.onChange([...selected, code]);
      }
      setQueryParams('');
    },
    [field, selected],
  );

  const remove = useMemo(
    () => (code: LanguageCode) => {
      field.onChange(selected.filter((selectedCode) => selectedCode !== code));
    },
    [field, selected],
  );

  return { selected, queryParams, setQueryParams, filtered, add, remove };
}
