'use client';

import React from 'react';
import { colors, typography } from '@avoo/design-tokens';
import { LANGUAGE_NAMES } from '@avoo/constants';

type Props = {
  languages: string[];
};

type ExtraProps = {
  showLabel?: boolean;
  labelStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
};

export const MasterLanguageList = ({
  languages,
  showLabel = false,
  labelStyle,
  textStyle,
}: Props & ExtraProps) => {
  if (!languages || languages.length === 0) {
    return (
      <div style={{ fontSize: typography.fontSize.xs, color: colors.gray[700] }}>No languages</div>
    );
  }

  const names = languages
    .map((lang) => {
      const raw = String(lang || '').trim();
      const key = raw.toLowerCase();
      return (
        (LANGUAGE_NAMES as Record<string, string>)[key] ??
        (raw ? raw[0].toUpperCase() + raw.slice(1).toLowerCase() : raw)
      );
    })
    .join(', ');

  const defaultLabelStyle: React.CSSProperties = {
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[700],
  };

  const defaultTextStyle: React.CSSProperties = {
    fontSize: '12px',
    color: colors.gray[500],
    fontFamily: `Roboto, ${typography.fontFamily.sans}`,
  };

  const finalLabelStyle = { ...defaultLabelStyle, ...(labelStyle || {}) };
  const finalTextStyle = { ...defaultTextStyle, ...(textStyle || {}) };

  return (
    <div style={finalTextStyle}>
      {showLabel ? <span style={finalLabelStyle}>Languages:&nbsp;</span> : null}
      {names}
    </div>
  );
};

export default MasterLanguageList;
