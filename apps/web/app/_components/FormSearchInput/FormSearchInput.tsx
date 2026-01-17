'use client';

import React, { useMemo, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { VALID_LANGUAGE_CODES, LANGUAGE_NAMES, type LanguageCode } from '@avoo/constants';
import { colors, typography } from '@avoo/design-tokens';
import SearchIcon from '@/_icons/SearchIcon';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  error?: string;
  className?: string;
};

function isLanguageCode(code: unknown): code is LanguageCode {
  if (typeof code !== 'string') return false;
  return VALID_LANGUAGE_CODES.includes(code as LanguageCode);
}

export default function FormSearchInput<T extends FieldValues>(props: Readonly<Props<T>>) {
  const { name, control, placeholder = 'Search language', error, className } = props;

  const { field } = useController({ name, control });

  const selectedItems = Array.isArray(field.value) ? field.value.filter(isLanguageCode) : [];

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return VALID_LANGUAGE_CODES.filter((code) => {
      const name = LANGUAGE_NAMES[code].toLowerCase();
      const codeLower = code.toLowerCase();
      return (name.includes(q) || codeLower.includes(q)) && !selectedItems.includes(code);
    });
  }, [query, selectedItems]);

  const handleAdd = (code: LanguageCode) => {
    if (!selectedItems.includes(code)) {
      field.onChange([...selectedItems, code]);
    }
    setQuery('');
  };

  const handleRemove = (code: LanguageCode) => {
    field.onChange(selectedItems.filter((c: LanguageCode) => c !== code));
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <div
        className={`flex items-center border ${error ? 'border-red-400' : 'border-gray-200'} rounded-md bg-white px-3 py-2 gap-2`}
      >
        <SearchIcon width={18} height={18} className='text-gray-400' />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className='flex-1 outline-none text-sm text-gray-700'
        />
      </div>

      {query && filtered.length > 0 && (
        <div className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-sm z-10'>
          {filtered.map((code) => (
            <button
              key={code}
              type='button'
              onClick={() => handleAdd(code)}
              className='w-full text-left px-3 py-2 hover:bg-gray-50 text-sm'
            >
              {LANGUAGE_NAMES[code]} ({code.toUpperCase()})
            </button>
          ))}
        </div>
      )}

      {error && <div className='mt-1 text-sm text-red-500'>{error}</div>}

      {selectedItems.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-2'>
          {selectedItems.map((code: LanguageCode) => (
            <div
              key={code}
              className='flex items-center gap-2 bg-primary-100 text-sm text-gray-800 px-2 py-1 rounded-full'
              style={{ backgroundColor: colors.primary[100] }}
            >
              <span style={{ fontSize: typography.fontSize.xs }}>
                {LANGUAGE_NAMES[code]} ({code.toUpperCase()})
              </span>
              <button
                type='button'
                onClick={() => handleRemove(code)}
                aria-label={`Remove ${code}`}
                className='ml-1 text-gray-600 hover:text-gray-800'
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
