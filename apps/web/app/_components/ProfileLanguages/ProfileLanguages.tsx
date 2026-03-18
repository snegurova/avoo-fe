'use client';

import { useTranslations } from 'next-intl';

import { LANGUAGE_NAMES, VALID_LANGUAGE_CODES } from '@avoo/constants';
import { colors } from '@avoo/design-tokens';
import { masterHooks } from '@avoo/hooks';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';

type Props = {
  languages: string[] | null;
};

const AVATAR_BG_BY_INDEX = [colors.primary[200], colors.blue[200], colors.orange[200]];

export const ProfileLanguages = (props: Props) => {
  const t = useTranslations('private.components.ProfileLanguages.ProfileLanguages');
  const { languages } = props;
  const mastersInfo = masterHooks.useGetMastersProfileInfo({ limit: 400 })?.items ?? [];

  if (!languages || languages.length === 0) return null;

  const languageGroups = languages.map((lang) => {
    const code = lang.toLowerCase();
    const matchedCode = VALID_LANGUAGE_CODES.find((validCode) => validCode === code);
    const name = matchedCode ? LANGUAGE_NAMES[matchedCode] : lang;
    const label = `${name} (${lang.toUpperCase()})`;
    const masters = mastersInfo.filter((master) =>
      master.languages?.some((language) => language.toLowerCase() === code),
    );
    return { lang, label, masters };
  });

  return (
    <div className='py-4'>
      <SectionHeader title={t('languages')} />
      <ul className='space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-4 lg:grid-cols-1'>
        {languageGroups.map(({ lang, label, masters }) => (
          <li key={lang} className='last:border-0 last:pb-0'>
            <p className='text-sm font-medium text-slate-900 mb-2 pb-2 border-b border-primary-100'>
              {label}
            </p>
            {masters.length > 0 && (
              <ul className='flex flex-wrap items-center gap-y-2'>
                {masters.map((master, index) => (
                  <li key={master.id} className='relative group -mr-2 hover:z-10'>
                    <Avatar
                      className='border-2 border-white'
                      name={master.name ?? t('masterFallback')}
                      src={master.avatarPreviewUrl ?? master.avatarUrl}
                      size={AvatarSize.Large}
                      bgColor={AVATAR_BG_BY_INDEX[index % AVATAR_BG_BY_INDEX.length]}
                    />
                    <span
                      className={`absolute top-full mt-1 px-2 py-1 rounded-[18px] bg-primary-100 text-primary-800 text-xs whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 ${
                        index === 0 ? 'left-0' : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      {master.name ?? t('masterFallback')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
