'use client';

import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import { IconButton } from '@/_components/IconButton/IconButton';
import { useNavigation } from '@/_hooks/useNavigation';

export default function PostsPage() {
  const { handleBackClick } = useNavigation();

  return (
    <AuthGuard>
      <div className='container mx-auto p-4 max-w-4xl'>
        <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />
        <SectionHeader title='Posts' />
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <p className='text-gray-500'>Posts content will be here</p>
        </div>
      </div>
    </AuthGuard>
  );
}
