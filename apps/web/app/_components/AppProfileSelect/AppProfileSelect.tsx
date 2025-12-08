'use client';

import React, { useState, useCallback } from 'react';
import { userHooks } from '@avoo/hooks';
import DropdownList from '@/_components/DropdownList/DropdownList';
import { useRouter } from 'next/navigation';
import { appRoutes } from '@/_routes/routes';
import { authHooks } from '@avoo/hooks';
import { Avatar, AvatarSize } from '@/_components/Avatar/Avatar';

export default function AppProfileSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const { visualProfileInfo } = userHooks.useGetUserProfile();
  const router = useRouter();
  const { logoutMutation } = authHooks.useLogout();

  const options = [
    {
      label: 'Profile',
      handler: () => {
        router.push(appRoutes.Profile);
      },
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
        <Avatar name={visualProfileInfo?.name} size={AvatarSize.Small} />
      </button>
      {isOpen && <DropdownList options={options} closeDropdown={closeDropdown} isRight />}
    </div>
  );
}
