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
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';
import TimeOffModal from '../TimeOffModal/TimeOffModal';

export default function AppNavigation() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isTimeOffOpen, setIsTimeOffOpen] = useState(false);

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
    base: 'flex items-center gap-3.5 px-8 py-3 hover:bg-primary-500 focus:bg-primary-500 transition-colors',
    variants: { active: { true: 'bg-primary-100' } },
  });

  const handleCalendarToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCalendarOpen((s) => !s);
  }, []);

  const handleOpenTimeOff = useCallback(() => {
    setIsTimeOffOpen(true);
  }, []);
  
  return (
    <aside className='h-full w-55 border-r border-gray-100'>
      <nav className='flex flex-col py-7 gap-15'>
        <div className='px-8'>
          <Link href={appRoutes.Home} className='font-inter font-semibold text-4xl text-gray-600'>
            Avoo
          </Link>
        </div>

        <ul className='flex flex-col'>
          {items.map((item) => (
            <li key={item.href}>
              {item.hasDropdown ? (
                (() => {
                  const isActive = routerHooks.useIsActivePage(item.href);
                  const cls = calendarNav({ active: isActive });
                  return (
                    <>
                      <div className={`${cls} relative flex items-center justify-between`}>
                        <Link href={item.href} className='flex items-center gap-3.5'>
                          {item.icon}
                          <span className='text-sm'>{item.label}</span>
                        </Link>

                        <button
                          type='button'
                          className='absolute right-3 top-0 bottom-0 px-3 flex items-center hover:bg-muted'
                          onClick={handleCalendarToggle}
                          aria-expanded={calendarOpen}
                          aria-haspopup='true'
                        >
                          {calendarOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        </button>
                      </div>

                      {calendarOpen && (
                        <ul className='flex flex-col pl-12'>
                          <li>
                            <button
                              type='button'
                              className='w-full text-left px-6 py-2 hover:bg-muted'
                              onClick={handleOpenTimeOff}
                            >
                              Time off
                            </button>
                          </li>
                        </ul>
                      )}
                    </>
                  );
                })()
              ) : (
                <AppNavigationItem href={item.href} icon={item.icon} label={item.label} />
              )}
            </li>
          ))}
        </ul>
        <TimeOffModal isOpen={isTimeOffOpen} onClose={() => setIsTimeOffOpen(false)} />
      </nav>
    </aside>
  );
}
