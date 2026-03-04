'use client';
import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import useMediaQuery from '@mui/material/useMediaQuery';
import { tv } from 'tailwind-variants';

import { localizationHooks } from '@/_hooks/localizationHooks';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';
import BookIcon from '@/_icons/BookIcon';
import CalendarIcon from '@/_icons/CalendarIcon';
import CoPresentIcon from '@/_icons/CoPresentIcon';
import GroupsIcon from '@/_icons/GroupsIcon';
import HomeIcon from '@/_icons/HomeIcon';
import MosaicIcon from '@/_icons/MosaicIcon';
import { AppRoutes } from '@/_routes/routes';

import AppNavigationItem from '../AppNavigationItem/AppNavigationItem';

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
  const pathname = usePathname();
  const locale = localizationHooks.useGetLocale();
  const isOpen = desktopAbove || menuOpen;

  const [calendarOpen, setCalendarOpen] = useState(false);

  const withLocale = useCallback((path: AppRoutes) => `/${locale}${path}`, [locale]);

  const homePath = withLocale(AppRoutes.Home);
  const calendarPath = withLocale(AppRoutes.Calendar);
  const clientsPath = withLocale(AppRoutes.Clients);
  const servicesPath = withLocale(AppRoutes.Services);
  const mastersPath = withLocale(AppRoutes.Masters);
  const postsPath = withLocale(AppRoutes.Posts);
  const workingHoursPath = withLocale(AppRoutes.WorkingHours);
  const timeOffPath = withLocale(AppRoutes.TimeOff);
  const isCalendarActive = pathname === calendarPath;

  const items = [
    {
      href: homePath,
      icon: <HomeIcon />,
      label: 'Home',
    },
    {
      href: calendarPath,
      icon: <CalendarIcon />,
      label: 'Calendar',
      hasDropdown: true,
    },
    {
      href: clientsPath,
      icon: <CoPresentIcon />,
      label: 'Clients',
    },
    {
      href: servicesPath,
      icon: <BookIcon />,
      label: 'Services',
    },
    {
      href: mastersPath,
      icon: <GroupsIcon />,
      label: 'Masters',
    },
    {
      href: postsPath,
      icon: <MosaicIcon />,
      label: 'Posts',
    },
  ];
  const calendarNav = tv({
    base: 'flex items-center gap-3.5 hover:bg-primary-100 focus:bg-primary-100 transition-colors',
    variants: { active: { true: 'bg-primary-50' } },
  });

  const handleCalendarToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCalendarOpen((s) => !s);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
    setCalendarOpen(false);
  }, [setMenuOpen]);

  const handleNavClick = useCallback(() => {
    if (!desktopAbove) handleCloseMenu();
  }, [desktopAbove, handleCloseMenu]);

  return (
    <aside className={overlayStyles({ open: isOpen })} onClick={handleCloseMenu}>
      <div className={sidebarStyles({ open: isOpen })} onClick={(e) => e.stopPropagation()}>
        <nav className='flex h-full flex-col py-7 gap-15'>
          <div className='px-8 shrink-0'>
            <Link
              href={homePath}
              className='font-inter font-semibold text-4xl text-gray-600'
              onClick={handleCloseMenu}
            >
              Avoo
            </Link>
          </div>

          <ul className='flex flex-col overflow-y-auto flex-1'>
            {items.map((item) => (
              <li key={item.href}>
                {item.hasDropdown ? (
                  <>
                    <div
                      className={`${calendarNav({ active: isCalendarActive })} relative flex items-center justify-between`}
                    >
                      <Link
                        href={item.href}
                        className='flex items-center grow px-8 py-3 gap-3.5'
                        onClick={handleCloseMenu}
                      >
                        {item.icon}
                        <span className=''>{item.label}</span>
                      </Link>

                      <button
                        type='button'
                        className='absolute right-0 top-0 bottom-0 pl-3 pr-6 flex items-center hover:bg-muted cursor-pointer'
                        onClick={handleCalendarToggle}
                        aria-expanded={calendarOpen}
                        aria-haspopup='true'
                      >
                        {calendarOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                      </button>
                    </div>

                    {calendarOpen && (
                      <ul className='flex flex-col font-light text-sm'>
                        <li className='w-full'>
                          <Link
                            href={workingHoursPath}
                            className='block w-full text-left pl-20 pr-4 py-2 hover:bg-primary-100 focus:bg-primary-100 transition-colors cursor-pointer'
                            onClick={handleNavClick}
                          >
                            Working schedule
                          </Link>
                        </li>
                        <li className='w-full'>
                          <Link
                            href={timeOffPath}
                            className='block w-full text-left pl-20 pr-4 py-2 hover:bg-primary-100 focus:bg-primary-100 transition-colors cursor-pointer'
                            onClick={handleNavClick}
                          >
                            Schedule exception
                          </Link>
                        </li>
                      </ul>
                    )}
                  </>
                ) : (
                  <AppNavigationItem
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    onClick={handleCloseMenu}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
