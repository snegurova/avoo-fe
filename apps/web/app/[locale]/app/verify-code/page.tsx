import { Metadata } from 'next/types';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import VerifyCodeForm from '@/_components/VerifyCodeForm/VerifyCodeForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tPage = await getTranslations({ locale, namespace: 'public.verifyCode.page' });

  return {
    title: tPage('metaTitle'),
    description: tPage('metaDescription'),
  };
}

export default function VerifyCodePage() {
  const t = useTranslations('private.verifyCode');
  return (
    <AuthorizationWrapper title={t('verifyCode')}>
      <VerifyCodeForm />
    </AuthorizationWrapper>
  );
}
