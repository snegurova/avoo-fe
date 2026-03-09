import { useMemo } from 'react';

import type { PhoneCodeOption } from '@avoo/constants';
import { PHONE_CODE_OPTIONS } from '@avoo/constants';

import { PhoneFieldLike, PhoneFieldReturn, usePhoneField } from './usePhoneField';

export const phoneHooks = {
  usePhoneField: (field: PhoneFieldLike): PhoneFieldReturn => usePhoneField(field),

  useFilterCodesByQuery: (searchQuery: string): PhoneCodeOption[] => {
    return useMemo(() => {
      if (!searchQuery.trim()) return PHONE_CODE_OPTIONS;
      const q = searchQuery.replace(/\D/g, '');
      return PHONE_CODE_OPTIONS.filter(
        (opt) => opt.value.replace('+', '').includes(q) || opt.label.replace('+', '').includes(q),
      );
    }, [searchQuery]);
  },
};
