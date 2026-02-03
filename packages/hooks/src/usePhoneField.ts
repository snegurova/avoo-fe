import { useState, useEffect, useCallback } from 'react';
import { PHONE_CODE_OPTIONS } from '@avoo/constants';
import { useRef } from 'react';

export type PhoneFieldLike = {
  value?: unknown;
  onChange: (v: string) => void;
};

export type PhoneFieldReturn = {
  countryCode: string;
  phoneNumber: string;
  setCountryCode: (code: string) => void;
  setPhoneNumber: (num: string) => void;
  maxNationalLength: number;
};

export function parsePhoneValue(value?: unknown) {
  const raw = (value ?? '')?.toString();
  if (raw.startsWith('+')) {
    const codes = PHONE_CODE_OPTIONS.map((c) => c.value).sort((a, b) => b.length - a.length);
    for (const code of codes) {
      if (raw.startsWith(code)) {
        const rest = raw.slice(code.length);
        return { countryCode: code, number: rest.replace(/\D/g, '') };
      }
    }
    const phoneRegex = /^(\+\d{1,4})(\d*)$/;
    const match = phoneRegex.exec(raw);
    if (match) return { countryCode: match[1], number: match[2] };
  }
  const defaultCode = PHONE_CODE_OPTIONS[0]?.value ?? '+38';
  return { countryCode: defaultCode, number: raw.replace(/\D/g, '') };
}

export const splitPhone = parsePhoneValue;

export function formatPhoneNumber(countryCode: string, number: string) {
  return `${countryCode}${number}`;
}

export const combinePhone = formatPhoneNumber;

export function usePhoneField(field: PhoneFieldLike) {
  const initial = parsePhoneValue(field.value);
  const [countryCode, setCountryCode] = useState<string>(initial.countryCode);
  const [initialNumber, setInitialNumber] = useState<string>(initial.number);
  const prevParsedRef = useRef({ countryCode: initial.countryCode, number: initial.number });
  const lastFormattedRef = useRef((field.value ?? '')?.toString());

  const MAX_E164 = 15;
  const MAX_NATIONAL = 12;

  useEffect(() => {
    const parsed = parsePhoneValue(field.value);
    if (
      parsed.countryCode !== prevParsedRef.current.countryCode ||
      parsed.number !== prevParsedRef.current.number
    ) {
      prevParsedRef.current = { countryCode: parsed.countryCode, number: parsed.number };
      setCountryCode(parsed.countryCode);
      setInitialNumber(parsed.number);
    }
  }, [field.value]);

  const setCode = useCallback(
    (code: string) => {
      setCountryCode((prev) => {
        if (prev === code) return prev;
        const formatted = initialNumber ? formatPhoneNumber(code, initialNumber) : '';
        const current = (field.value ?? '')?.toString();
        if (current !== formatted) {
          lastFormattedRef.current = formatted;
          field.onChange(formatted);
        }
        return code;
      });
    },
    [field, initialNumber],
  );

  const setNumber = useCallback(
    (num: string) => {
      const cleaned = num.replace(/\D/g, '');
      const countryDigits = (countryCode.replace('+', '') || '').length;
      const maxAllowed = Math.max(0, Math.min(MAX_NATIONAL, MAX_E164 - countryDigits));
      const truncated = cleaned.slice(0, maxAllowed);
      setInitialNumber((prev) => {
        if (prev === truncated) return prev;
        const formatted = truncated ? formatPhoneNumber(countryCode, truncated) : '';
        const current = (field.value ?? '')?.toString();
        if (current !== formatted) {
          lastFormattedRef.current = formatted;
          field.onChange(formatted);
        }
        return truncated;
      });
    },
    [field, countryCode],
  );

  const result: PhoneFieldReturn = {
    countryCode,
    phoneNumber: initialNumber,
    setCountryCode: setCode,
    setPhoneNumber: setNumber,
    maxNationalLength: Math.max(
      0,
      Math.min(MAX_NATIONAL, MAX_E164 - (countryCode.replace('+', '') || '').length),
    ),
  };

  return result;
}
