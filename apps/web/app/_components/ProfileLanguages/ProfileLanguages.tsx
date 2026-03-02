'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/_routes/routes';
import { IconButton } from '@/_components/IconButton/IconButton';
import { localizationHooks } from '@/_hooks/localizationHooks';

type Props = {
  languages: string[] | null;
};

export const ProfileLanguages = (props: Props) => {
  const { languages } = props;
  const router = useRouter();
  const editLanguagesPath = localizationHooks.useWithLocale(AppRoutes.EditLanguages);

  const handleNavigateToEditLanguages = useCallback(() => {
    router.push(editLanguagesPath);
  }, [router, editLanguagesPath]);

  const handleNavigate = useCallback(() => {
    handleNavigateToEditLanguages();
  }, [handleNavigateToEditLanguages]);

  return (
    <div className='flex items-center justify-between px-5 py-3'>
      <div className='flex items-center gap-2'>
        <span className='text-base text-slate-900'>
          {languages?.join(' ') ?? 'Languages not set'}
        </span>
      </div>
      <IconButton icon='✏️' onClick={handleNavigate} ariaLabel='Edit Languages' />
    </div>
  );
};
