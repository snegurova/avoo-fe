import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { SUPPORTED_LOCALES } from '@avoo/intl';
import { messages } from '@avoo/intl/messages/private/navigation/navigation';

import { localizationHooks } from '@/_hooks/localizationHooks';
import LanguageIcon from '@/_icons/LanguageIcon';

export default function LanguageSwitcher() {
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
      label: <FormattedMessage {...messages[locale as keyof typeof messages]} />,
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
      <button
        className='w-full cursor-pointer text-start transition-colors rounded-xl flex items-center gap-2 text-gray-700 font-medium p-3 text-sm leading-[1.15] hover:bg-primary-100 focus:bg-primary-100'
        onMouseEnter={onOpen}
        onFocus={onOpen}
        tabIndex={0}
      >
        <LanguageIcon />
        <span className=''>
          {<FormattedMessage {...messages[currLocale as keyof typeof messages]} />}
        </span>
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
              className='w-full cursor-pointer text-start transition-colors rounded-xl text-gray-700 font-medium p-3 text-sm leading-[1.15] hover:bg-primary-100 focus:bg-primary-100'
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
