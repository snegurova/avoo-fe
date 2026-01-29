'use client';

import React from 'react';
import CloseIcon from '@/_icons/CloseIcon';
import {
  IconButton,
  IconButtonSize,
  IconButtonRounded,
  IconButtonVariant,
} from '@/_components/IconButton/IconButton';
import { colors, typography } from '@avoo/design-tokens';
import { LANGUAGE_NAMES, type LanguageCode } from '@avoo/constants';

type Props = {
  code: LanguageCode;
  onRemove: (code: LanguageCode) => void;
};

export default function LanguageChip({ code, onRemove }: Readonly<Props>) {
  return (
    <div
      key={code}
      className='flex items-center gap-3 bg-primary-100 text-sm text-gray-800 px-4 py-2 rounded-full'
      style={{ backgroundColor: colors.primary[100] }}
    >
      <span style={{ fontSize: typography.fontSize.xs }}>
        {LANGUAGE_NAMES[code]} ({code.toUpperCase()})
      </span>
      <IconButton
        icon={<CloseIcon width={14} height={14} />}
        onClick={() => onRemove(code)}
        ariaLabel={`Remove ${code}`}
        size={IconButtonSize.Small}
        rounded={IconButtonRounded.Full}
        variant={IconButtonVariant.Secondary}
        className='bg-white'
      />
    </div>
  );
}
