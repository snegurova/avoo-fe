'use client';

import { useRouter } from 'next/navigation';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import { IconButton } from '@/_components/IconButton/IconButton';

export default function EditProfilePage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className='container mx-auto p-4 max-w-4xl'>
        <IconButton icon='⬅' onClick={handleBack} ariaLabel='Back' />
        <SectionHeader title='Edit Profile' />
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          <p className='text-gray-500'>Edit profile content will be here</p>
        </div>
      </div>
    </AuthGuard>
  );
}
