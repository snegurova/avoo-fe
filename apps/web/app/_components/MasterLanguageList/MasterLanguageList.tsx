'use client';

import React from 'react';
import { colors, typography } from '@avoo/design-tokens';

type Props = {
  languages: string[];
};

export const MasterLanguageList = ({ languages }: Props) => {
  if (!languages || languages.length === 0) {
    return (
      <div style={{ fontSize: typography.fontSize.xs, color: colors.black }}>No languages</div>
    );
  }

  return (
    <div className='flex gap-2 flex-wrap'>
      {languages.map((lang, idx) => (
        <span
          key={idx}
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.black,
          }}
          className='bg-gray-100 rounded-full px-2 py-1 text-xs'
        >
          {lang.toUpperCase()}
        </span>
      ))}
    </div>
  );
};

export default MasterLanguageList;
