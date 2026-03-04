'use client';
import React from 'react';
import bg from '@/_images/auth-bg.jpg';
import Link from 'next/link';
import { AppRoutes } from '@/_routes/routes';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export default function AuthorizationWrapper(props: Props) {
  const { children, title, description } = props;

  return (
    <div className='grid grid-cols-2 h-screen'>
      <div className='flex justify-end h-full'>
        <div className='px-15 py-6 flex flex-col justify-between gap-20 h-full w-full max-w-180'>
          <div className=''>
            <LocalizedLink
              href={AppRoutes.Home}
              className='font-inter font-semibold text-4xl text-gray-600'
            >
              Avoo
            </LocalizedLink>
          </div>
          <div className='flex flex-col justify-center md:px-5 2xl:px-15 w-full'>
            <div className='w-full mb-14'>
              <h1 className='text-center text-2xl font-medium tracking-tight mb-6'>{title}</h1>
              <p className='text-center'>{description}</p>
            </div>
            {children}
          </div>
          <div className='flex items-center gap-15 justify-between text-xs leading-normal'>
            <span>© {new Date().getFullYear()} Avoo</span>
            <Link href='#' className='font-medium hover:text-primary-600 focus:text-primary-600'>
              Privacy Policy
            </Link>
            <span>Project 123</span>
          </div>
        </div>
      </div>
      <div
        className='bg-center bg-cover'
        style={{
          backgroundImage: `url(${bg.src})`,
        }}
      >
        <div className='px-8 pt-[30%]'>
          <p className='text-[8.375rem] font-advent-pro text-gray-800 mb-7 text-center leading-none'>
            AVOO
          </p>
          <p className='font-montserrat text-2xl text-gray-600 capitalize text-center'>
            More clients. One calendar. Zero chaos.
          </p>
        </div>
      </div>
    </div>
  );
}
