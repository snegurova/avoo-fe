import { usePhoneField, PhoneFieldReturn, PhoneFieldLike } from './usePhoneField';

export const phoneHooks = {
  usePhoneField: (field: PhoneFieldLike): PhoneFieldReturn => usePhoneField(field),
};
