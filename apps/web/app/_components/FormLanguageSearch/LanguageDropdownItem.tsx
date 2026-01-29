'use client';

import React from 'react';
import { LANGUAGE_NAMES, type LanguageCode } from '@avoo/constants';

type Props = {
  code: LanguageCode;
  onSelect: (code: LanguageCode) => void;
};

export default function LanguageDropdownItem({ code, onSelect }: Readonly<Props>) {
  return (
    <button
      type='button'
      onClick={() => onSelect(code)}
      className='w-full text-left px-3 py-2 hover:bg-gray-50 text-sm'
    >
      {LANGUAGE_NAMES[code]} ({code.toUpperCase()})
    </button>
  );
}
