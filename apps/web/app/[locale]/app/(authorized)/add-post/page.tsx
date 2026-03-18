'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function AppPostPage() {
  const t = useTranslations('private.addPost');
  return <>{t('appPostPage')}</>;
}
