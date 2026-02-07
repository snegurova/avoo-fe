import { useMemo } from 'react';
import { PHONE_CODE_OPTIONS } from '@avoo/constants';
import type { PhoneCodeOption } from '@avoo/constants';
import { usePhoneField, PhoneFieldReturn, PhoneFieldLike } from './usePhoneField';

export const phoneHooks = {
  usePhoneField: (field: PhoneFieldLike): PhoneFieldReturn => usePhoneField(field),

  useFilterPhoneCodes: (searchQuery: string): PhoneCodeOption[] => {
    return useMemo(() => {
      if (!searchQuery.trim()) return PHONE_CODE_OPTIONS;
      const q = searchQuery.replace(/\D/g, '');
      return PHONE_CODE_OPTIONS.filter(
        (opt) =>
          opt.value.replace('+', '').includes(q) || opt.label.replace('+', '').includes(q),
      );
    }, [searchQuery]);
  },
};
