'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function NotificationsPage() {
  const t = useTranslations('private.notifications');
  return <>{t('notificationsPage')}</>;
}
