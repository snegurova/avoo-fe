import { Metadata } from 'next/types';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import ResetPasswordForm from '@/_components/ResetPasswordForm/ResetPasswordForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public.resetPassword.page' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function ResetPasswordPage() {
  const t = useTranslations('private.resetPassword');
  const tPage = useTranslations('public.resetPassword.page');
  return (
    <AuthGuard>
      <AuthorizationWrapper title={t('createNewPassword')} description={tPage('description')}>
        <ResetPasswordForm />
      </AuthorizationWrapper>
    </AuthGuard>
  );
}
