'use client';
import React from 'react';
import bg from '@/_images/auth-bg.jpg';
import Link from 'next/link';
import { AppRoutes } from '@/_routes/routes';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import { FormattedMessage } from 'react-intl';
import { messages } from '@avoo/intl/messages/public/authorizationWrapper/index';

type Props = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
};

export default function AuthorizationWrapper(props: Props) {
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
              Avoo
            </LocalizedLink>
          </div>
          <div className='flex flex-col justify-center xl:px-5 2xl:px-15 w-full'>
            <div className='w-full mb-8 2xl:mb-14'>
              <h1 className='text-center text-xl xl:text-3xl font-medium tracking-tight mb-6'>
                {title}
              </h1>
              <p className='text-center text-sm xl:text-base'>{description}</p>
            </div>
            {children}
          </div>
          <div className='flex items-center gap-15 justify-between text-xs leading-normal'>
            <span>© {new Date().getFullYear()} Avoo</span>
            <Link
              href='#'
              className='font-medium text-sm hover:text-primary-600 focus:text-primary-600'
            >
              <FormattedMessage {...messages.privacyPolicy} />
            </Link>
            <span>
              <FormattedMessage {...messages.project} />
            </span>
          </div>
        </div>
      </div>
      <div
        className='bg-center bg-cover hidden md:block'
        style={{
          backgroundImage: `url(${bg.src})`,
        }}
      >
        <div className='px-8 pt-[30%]'>
          <p className='text-8xl xl:text-[8.375rem] font-advent-pro text-gray-800 mb-7 text-center leading-none'>
            AVOO
          </p>
          <p className='font-montserrat text-2xl text-gray-600 capitalize text-center'>
            <FormattedMessage {...messages.slogan} />
          </p>
        </div>
      </div>
    </div>
  );
}
