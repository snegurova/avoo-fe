'use client';
import React from 'react';
import Link from 'next/link';
import { appRoutes } from '@/_routes/routes';
import AppNavigationItem from '../AppNavigationItem/AppNavigationItem';
import HomeIcon from '@/_icons/HomeIcon';
import CalendarIcon from '@/_icons/CalendarIcon';
import GroupsIcon from '@/_icons/GroupsIcon';
import BookIcon from '@/_icons/BookIcon';
import MosaicIcon from '@/_icons/MosaicIcon';
import CoPresentIcon from '@/_icons/CoPresentIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import { tv } from 'tailwind-variants';

type Props = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const overlayStyles = tv({
  base: 'fixed top-0 bottom-0 left-0 right-0 bg-primary-100/50 lg:static h-full z-20 inset-0 transition-opacity duration-300',
  variants: {
    open: {
      true: 'opacity-100 pointer-events-auto',
      false: 'opacity-0 pointer-events-none',
    },
  },
});

const sidebarStyles = tv({
  base: `
    fixed top-0 left-0 z-30 w-55 border-r border-gray-100 bg-white h-full transform transition-transform duration-300 ease-out lg:static lg:translate-x-0
  `,
  variants: {
    open: {
      true: 'translate-x-0',
      false: '-translate-x-full lg:translate-x-0',
    },
  },
});

export default function AppNavigation({ menuOpen, setMenuOpen }: Props) {
  const desktopAbove = useMediaQuery('(min-width:1024px)');
  const isOpen = desktopAbove || menuOpen;

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
      href: appRoutes.Clients,
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
      icon: <MosaicIcon />,
      label: 'Posts',
    },
  ];
  return (
    <aside className={overlayStyles({ open: isOpen })} onClick={() => setMenuOpen(false)}>
      <div className={sidebarStyles({ open: isOpen })} onClick={(e) => e.stopPropagation()}>
        <nav className='flex h-full flex-col py-7 gap-15'>
          <div className='px-8 shrink-0'>
            <Link
              href={appRoutes.Home}
              className='font-inter font-semibold text-4xl text-gray-600'
              onClick={() => setMenuOpen(false)}
            >
              Avoo
            </Link>
          </div>

          <ul className='flex flex-col overflow-y-auto flex-1'>
            {items.map((item) => (
              <li key={item.href}>
                <AppNavigationItem
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => setMenuOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
