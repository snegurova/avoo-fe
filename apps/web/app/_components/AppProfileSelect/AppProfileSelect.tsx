'use client';

import React, { useCallback, useState } from 'react';

import { userHooks } from '@avoo/hooks';

import AppProfileDropdown from '@/_components/AppProfileDropdown/AppProfileDropdown';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';

export default function AppProfileSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const { visualProfileInfo } = userHooks.useGetUserProfile();

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
        <Avatar
          name={visualProfileInfo.name}
          size={AvatarSize.Large}
          src={visualProfileInfo.avatarUrl}
        />
      </button>
      {isOpen && <AppProfileDropdown closeDropdown={closeDropdown} />}
    </div>
  );
}
