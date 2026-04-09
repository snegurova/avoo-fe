'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import bg from '@/_images/decor_powder.webp';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
};

export default function AuthorizationWrapper(props: Props) {
  const tCommon = useTranslations('private.components.AuthorizationWrapper.AuthorizationWrapper');
  const t = useTranslations('public.authorizationWrapper.index');
  const { children, title, description } = props;

  return (
    <div className='grid md:grid-cols-[480px_1fr] lg:grid-cols-2 h-screen'>
      <div className='flex justify-end h-full'>
        <div className='px-5 xl:px-10 2xl:px-15 py-6 flex flex-col justify-between gap-12 h-full w-full max-w-180 '>
          <div className=''>
            <LocalizedLink
              href={AppRoutes.Home}
              className='font-inter font-semibold text-4xl text-gray-600'
            >
              {tCommon('avoo')}
            </LocalizedLink>
          </div>
          <div className='flex flex-col justify-center xl:px-5 2xl:px-15 w-full'>
            <div className={`w-full ${description ? 'mb-8 2xl:mb-14' : 'mb-6'}`}>
              <h1 className='text-center text-xl xl:text-3xl font-medium tracking-tight '>
                {title}
              </h1>
              {description && (
                <p className='text-center text-sm xl:text-base mt-6'>{description}</p>
              )}
            </div>
            {children}
          </div>
          <div className='flex items-center gap-15 justify-between text-xs leading-normal'>
            <span>
              © {new Date().getFullYear()} {tCommon('avoo')}
            </span>
            <Link
              href='#'
              className='font-medium text-sm hover:text-primary-600 focus:text-primary-600'
            >
              {t('privacyPolicy')}
            </Link>
          </div>
        </div>
      </div>

      <div
        className='bg-[20%] bg-cover hidden md:flex items-center justify-center bg-black/70'
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bg.src})`,
        }}
      >
        <div className='px-8 text-center'>
          <p className='text-8xl xl:text-[8.375rem] font-advent-pro font-medium text-fuchsia-50 mb-7 leading-none'>
            {tCommon('avooCaps')}
          </p>
          <p className='font-montserrat font-medium text-2xl text-fuchsia-50 capitalize'>
            {t('slogan')}
          </p>
        </div>
      </div>
    </div>
  );
}
