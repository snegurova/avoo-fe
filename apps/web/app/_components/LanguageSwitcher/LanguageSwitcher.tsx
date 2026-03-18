import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import { SUPPORTED_LOCALES } from '@avoo/intl';

import { localizationHooks } from '@/_hooks/localizationHooks';
import LanguageIcon from '@/_icons/LanguageIcon';

const mainButton = tv({
  base: 'w-full cursor-pointer text-start transition-colors rounded-xl flex items-center gap-2 text-gray-700 font-medium text-sm leading-[1.15]',
  variants: {
    type: {
      public: 'text-gray-600 hover:bg-gray-200 focus:bg-gray-200 py-1 px-3',
      private: 'hover:bg-primary-100 focus:bg-primary-100 text-gray-700 p-3',
    },
  },
});

const button = tv({
  base: 'w-full cursor-pointer text-start transition-colors rounded-xl flex items-center gap-2 text-gray-700 font-medium p-3 text-sm leading-[1.15]',
  variants: {
    type: {
      public: 'text-gray-600 hover:bg-gray-200 focus:bg-gray-200',
      private: 'hover:bg-primary-100 focus:bg-primary-100 text-gray-700',
    },
  },
});

const icon = tv({
  base: 'w-6 h-6',
  variants: {
    type: {
      public: 'fill-gray-600',
      private: 'fill-gray-700',
    },
  },
});

type Props = {
  type?: 'public' | 'private';
};

export default function LanguageSwitcher({ type = 'private' }: Props) {
  const t = useTranslations('private.navigation.navigation');
  const [isOpen, setIsOpen] = useState(false);

  const currLocale = localizationHooks.useGetLocale();

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleLocaleChange = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    if ((SUPPORTED_LOCALES as readonly string[]).includes(pathParts[1])) {
      pathParts[1] = newLocale;
    } else {
      pathParts.splice(1, 0, newLocale);
    }
    const newPath = pathParts.join('/') + window.location.search + window.location.hash;
    window.location.assign(newPath);
  };

  const options = useMemo(() => {
    return SUPPORTED_LOCALES.map((locale) => ({
      label: t(locale as Parameters<typeof t>[0]),
      handler: () => handleLocaleChange(locale),
    }));
  }, [SUPPORTED_LOCALES]);

  return (
    <div
      className='relative'
      onMouseLeave={onClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          onClose();
        }
      }}
      tabIndex={-1}
    >
      <button className={mainButton({ type })} onMouseEnter={onOpen} onFocus={onOpen} tabIndex={0}>
        <LanguageIcon className={icon({ type })} />
        {t(currLocale as Parameters<typeof t>[0])}
      </button>
      {isOpen && (
        <div className='absolute top-full w-full overflow-hidden rounded-xl z-15 right-0 bg-white border border-gray-200 flex flex-col'>
          {options.map((option, index) => (
            <button
              key={`language-option-${index}`}
              type='button'
              onClick={option.handler}
              onFocus={onOpen}
              onBlur={(e) => {
                if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) {
                  onClose();
                }
              }}
              className={button({ type })}
              tabIndex={0}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
