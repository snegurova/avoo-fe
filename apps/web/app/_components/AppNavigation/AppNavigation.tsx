'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { appRoutes } from '@/_routes/routes';
import AppNavigationItem from '../AppNavigationItem/AppNavigationItem';
import { tv } from 'tailwind-variants';
import { routerHooks } from '@/_hooks/routerHooks';
import HomeIcon from '@/_icons/HomeIcon';
import CalendarIcon from '@/_icons/CalendarIcon';
import GroupsIcon from '@/_icons/GroupsIcon';
import BookIcon from '@/_icons/BookIcon';
import MosaicIcon from '@/_icons/MosaicIcon';
import CoPresentIcon from '@/_icons/CoPresentIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';

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

  const [calendarOpen, setCalendarOpen] = useState(false);

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
      hasDropdown: true,
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
  }, []);

  const handleNavClick = useCallback(() => {
    if (!desktopAbove) handleCloseMenu();
  }, [desktopAbove, handleCloseMenu]);

  return (
    <aside className={overlayStyles({ open: isOpen })} onClick={handleCloseMenu}>
      <div className={sidebarStyles({ open: isOpen })} onClick={(e) => e.stopPropagation()}>
        <nav className='flex h-full flex-col py-7 gap-15'>
          <div className='px-8 shrink-0'>
            <Link
              href={appRoutes.Home}
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
                  (() => {
                    const isActive = routerHooks.useIsActivePage(item.href);
                    const cls = calendarNav({ active: isActive });
                    return (
                      <>
                        <div className={`${cls} relative flex items-center justify-between`}>
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
                          <ul className='flex flex-col'>
                            <li className='w-full'>
                              <Link
                                href={appRoutes.TimeOff}
                                className='block w-full text-left pl-20 pr-4 py-2 text-sm hover:bg-primary-100 focus:bg-primary-100 transition-colors cursor-pointer'
                                onClick={handleNavClick}
                              >
                                Schedule exception
                              </Link>
                            </li>
                          </ul>
                        )}
                      </>
                    );
                  })()
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
