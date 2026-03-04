'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { userHooks } from '@avoo/hooks';
import { authHooks } from '@avoo/hooks';

import { AvatarSize, CalendarAvatar } from '@/_components/CalendarAvatar/CalendarAvatar';
import DropdownList from '@/_components/DropdownList/DropdownList';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export default function AppProfileSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const { visualProfileInfo } = userHooks.useGetUserProfile();
  const router = useRouter();
  const { logoutMutation } = authHooks.useLogout();
  const profilePath = localizationHooks.useWithLocale(AppRoutes.Profile);

  const handleNavigateToProfile = useCallback(() => {
    router.push(profilePath);
  }, [router, profilePath]);

  const options = [
    {
      label: 'Profile',
      handler: handleNavigateToProfile,
    },
    {
      label: 'Logout',
      handler: () => {
        logoutMutation();
      },
    },
  ];

  const toggleOpen = () => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-profile-container')) {
        setIsOpen(false);
      }
    };
    if (!isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    setIsOpen((prev) => !prev);
  };

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className='relative select-profile-container'>
      <button className='rounded-full cursor-pointer' onClick={toggleOpen}>
        <CalendarAvatar name={visualProfileInfo?.name} size={AvatarSize.Large} />
      </button>
      {isOpen && <DropdownList options={options} closeDropdown={closeDropdown} />}
    </div>
  );
}
