import React from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import PublicSearch from '@/_components/PublicSearch/PublicSearch';

type Props = {
  isActive: boolean;
  title: string;
  search?: string;
  setSearch?: (value: string) => void;
  placeholder?: string;
  noSelect?: boolean;
};

const titleWrapper = tv({
  base: 'py-2 transition-colors flex flex-col md:flex-row gap-1 md:gap-10 items-start md:items-center pr-4 rounded-lg',
  variants: {
    active: {
      true: 'bg-gray-200 ',
      false: '',
    },
  },
});

const titleStyle = tv({
  base: 'font-medium text-base leading-loose text-black transition-transform',
  variants: {
    active: {
      true: 'translate-x-6',
      false: '',
    },
  },
});

export default function PublicOrderTitle(props: Props) {
  const { isActive, title, search, setSearch, placeholder, noSelect = false } = props;

  const t = useTranslations('public.salon.createOrder');

  return (
    <div className={titleWrapper({ active: isActive })}>
      <h3 className={titleStyle({ active: isActive })}>
        {t(isActive && !noSelect ? 'select' + title : title)}
      </h3>
      {isActive && search !== undefined && setSearch !== undefined && (
        <PublicSearch
          placeholder={placeholder ?? t('search')}
          value={search}
          onChange={setSearch}
        />
      )}
    </div>
  );
}
