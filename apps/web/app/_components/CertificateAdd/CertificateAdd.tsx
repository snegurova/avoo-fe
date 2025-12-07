'use client';

import { useRouter } from 'next/router';
import { appRoutes } from '@/_routes/routes';
import { userHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';

export const CertificateAdd = () => {
  const router = useRouter();
  const { handleAddCertificate } = userHooks.usePostCertificate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const issueDate = formData.get('issueDate') as string;
    handleAddCertificate({ title, description, issueDate });
    router.push(appRoutes.Certificates);
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Add Certificate</h2>
      <div className='mb-4'>
        <label htmlFor='title' className='block text-gray-700 font-semibold mb-2'>
          Title
        </label>
        <input type='text' id='title' name='title' required />
        <input
          type='text'
          id='description'
          name='description'
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Enter certificate description'
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='issueDate' className='block text-gray-700 font-semibold mb-2'>
          Issue Date
        </label>
        <input type='date' id='issueDate' name='issueDate' required />
      </div>
      <div className='flex justify-end gap-3'>
        <Button
          type='button'
          intent={ButtonIntent.Cancel}
          fit={ButtonFit.Inline}
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <Button type='submit' intent={ButtonIntent.Submit} fit={ButtonFit.Inline}>
          Save
        </Button>
      </div>
    </form>
  );
};
