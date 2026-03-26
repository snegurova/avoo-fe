import { Metadata } from 'next/types';
import { getTranslations } from 'next-intl/server';

import LandingPage from '@/_components/LandingPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public.home.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  return <LandingPage />;
}
