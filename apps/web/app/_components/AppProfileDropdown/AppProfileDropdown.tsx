import React from 'react';
import { FormattedMessage } from 'react-intl';
import Link from 'next/link';

import { tv } from 'tailwind-variants';

import { authHooks, userHooks } from '@avoo/hooks';
import { messages } from '@avoo/intl/messages/private/navigation/navigation';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import LanguageSwitcher from '@/_components/LanguageSwitcher/LanguageSwitcher';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  closeDropdown: () => void;
};

const button = tv({
  base: 'w-full cursor-pointer text-start transition-colors rounded-xl flex items-center gap-2 text-gray-700 font-medium p-3 text-sm leading-[1.15] hover:bg-primary-100 focus:bg-primary-100',
});

export default function AppProfileDropdown(props: Props) {
  const { closeDropdown } = props;
  const { logoutMutation } = authHooks.useLogout();
  const { visualProfileInfo } = userHooks.useGetUserProfile();

  const profilePath = localizationHooks.useWithLocale(AppRoutes.Profile);
  const accountSettingsPath = localizationHooks.useWithLocale(AppRoutes.AccountSettings);
  const securitySettingsPath = localizationHooks.useWithLocale(AppRoutes.SecuritySettings);

  const links = [
    {
      label: <FormattedMessage {...messages.profile} />,
      link: profilePath,
    },
    {
      label: <FormattedMessage {...messages.accountSettings} />,
      link: accountSettingsPath,
    },
    {
      label: <FormattedMessage {...messages.securitySettings} />,
      link: securitySettingsPath,
    },
  ];

  return (
    <div className='absolute top-full min-w-max translate-y-2 rounded-2xl z-15 right-0 bg-white border border-gray-200 py-4 px-3 translate-x-2'>
      <div className='py-3 pl-3 pr-6 flex items-center gap-3 border-b border-primary-100'>
        <Avatar
          name={visualProfileInfo.name}
          size={AvatarSize.Large}
          src={visualProfileInfo.avatarPreviewUrl}
        />
        <div className='flex flex-col gap-1.5 tracking-wider leading-none'>
          <p className='text-sm font-medium'>{visualProfileInfo?.name}</p>
          <p className='text-xs text-gray-500 tracking-wider leading-none'>
            {visualProfileInfo?.email || visualProfileInfo?.phone}
          </p>
        </div>
      </div>
      <div className='border-b border-primary-100'>
        {links.map((option, index) => (
          <Link
            key={`profile-menu-${index}`}
            className={button()}
            onClick={() => {
              closeDropdown();
            }}
            href={option.link}
          >
            {option.label}
          </Link>
        ))}
        <LanguageSwitcher />
      </div>
      <div className=''>
        <button
          type='button'
          className={button()}
          onClick={() => {
            logoutMutation();
            closeDropdown();
          }}
        >
          <FormattedMessage {...messages.logout} />
        </button>
      </div>
    </div>
  );
}
