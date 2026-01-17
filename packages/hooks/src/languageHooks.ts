import { useMemo } from 'react';
import { VALID_LANGUAGE_CODES, LANGUAGE_NAMES } from '@avoo/constants';

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
};
