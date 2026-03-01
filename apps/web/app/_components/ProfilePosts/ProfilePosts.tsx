'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/_routes/routes';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { localizationHooks } from '@/_hooks/localizationHooks';

export const ProfilePosts = () => {
  const router = useRouter();
  const postsPath = localizationHooks.useWithLocale(AppRoutes.Posts);

  const handleNavigateToPosts = useCallback(() => {
    router.push(postsPath);
  }, [router, postsPath]);

  const handleNavigate = useCallback(() => {
    handleNavigateToPosts();
  }, [handleNavigateToPosts]);

  return (
    <div className='px-5 py-4'>
      <SectionHeader title='Posts' onEdit={handleNavigate} />
      <div className='text-center py-8'>
        <div className='bg-gray-200 rounded-lg w-20 h-20 mx-auto mb-4' />
        <p className='text-base font-semibold text-slate-900 mb-2'>No recent Posts</p>
        <p className='text-sm text-slate-500 mb-2'>Make new post and promote your service</p>
        <Link href={postsPath} className='text-sm text-blue-600 underline'>
          Add post
        </Link>
      </div>
    </div>
  );
};
