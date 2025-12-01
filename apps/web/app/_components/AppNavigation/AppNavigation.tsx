'use client';
import React from 'react';
import Link from 'next/link';
import { appRoutes } from '@/_routes/routes';
import AppNavigationItem from '../AppNavigationItem/AppNavigationItem';
import HomeIcon from '@/_icons/HomeIcon';
import CalendarIcon from '@/_icons/CalendarIcon';
import GroupsIcon from '@/_icons/GroupsIcon';
import BookIcon from '@/_icons/BookIcon';
import AddPhotoIcon from '@/_icons/AddPhotoIcon';
import CoPresentIcon from '@/_icons/CoPresentIcon';

export default function AppNavigation() {
  const items = [
    {
      href: appRoutes.Home,
      icon: <HomeIcon />,
      label: 'Home',
    },
    {
      href: appRoutes.Calendar,
      icon: <CalendarIcon />,
      label: 'Calendar',
    },
    {
      href: appRoutes.Clietns,
      icon: <CoPresentIcon />,
      label: 'Clients',
    },
    {
      href: appRoutes.Services,
      icon: <BookIcon />,
      label: 'Services',
    },
    {
      href: appRoutes.Masters,
      icon: <GroupsIcon />,
      label: 'Masters',
    },
    {
      href: appRoutes.Posts,
      icon: <AddPhotoIcon />,
      label: 'Posts',
    },
  ];
  return (
    <aside className='h-full min-w-55 border-r border-border'>
      <nav className='flex flex-col py-7 gap-15'>
        <div className='px-8'>
          <Link href={appRoutes.Home} className='font-inter font-semibold text-4xl text-logo'>
            Avoo
          </Link>
        </div>

        <ul className='flex flex-col'>
          {items.map((item) => (
            <li key={item.href}>
              <AppNavigationItem href={item.href} icon={item.icon} label={item.label} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
