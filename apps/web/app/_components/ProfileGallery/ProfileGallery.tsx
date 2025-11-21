'use client';

import { useRouter } from 'next/navigation';
import { userHooks } from '@avoo/hooks';
import { routes } from '@/_routes/routes';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';

export const ProfileGallery = () => {
  const userMedia = userHooks.useGetUserMedia();
  const router = useRouter();

  const handleEdit = () => {
    router.push(routes.Gallery);
  };

  if (!userMedia?.items || userMedia.items.length === 0) {
    return (
      <>
        <SectionHeader title='Gallery' onEdit={handleEdit} />
        <div className='text-center py-8'>
          <p className='text-sm text-slate-500 mb-2'>Show clients your place and service</p>
          <button onClick={handleEdit} className='text-sm text-blue-600 underline'>
            Add gallery
          </button>
        </div>
      </>
    );
  }

  return (
    <div className='px-5 py-4 border-t border-gray-200'>
      <SectionHeader title='Gallery' onEdit={handleEdit} />

      <div className='flex gap-3 overflow-x-auto'>
        {userMedia.items.map((item) => (
          <div key={item.id} className='bg-gray-200 rounded-lg w-20 h-20 flex-shrink-0' />
        ))}
      </div>
    </div>
  );
};
