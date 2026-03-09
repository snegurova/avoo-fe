import { useMemo } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

import { LANGUAGE_NAMES, VALID_LANGUAGE_CODES } from '@avoo/constants';

import { useLanguagePicker } from './useLanguagePicker';

export const languageHooks = {
  useFilterLanguages: (searchQuery: string) => {
    return useMemo(() => {
      if (!searchQuery.trim()) return VALID_LANGUAGE_CODES;

      const query = searchQuery.toLowerCase();
      return VALID_LANGUAGE_CODES.filter((code) => {
        const name = LANGUAGE_NAMES[code].toLowerCase();
        const codeLower = code.toLowerCase();
        return name.includes(query) || codeLower.includes(query);
      });
    }, [searchQuery]);
  },
  useLanguagePicker: <T extends FieldValues>(control: Control<T>, name: Path<T>) =>
    useLanguagePicker(control, name),
};
