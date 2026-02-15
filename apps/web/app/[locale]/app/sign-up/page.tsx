import { Metadata } from 'next/types';
import RegisterForm from '@/_components/RegisterForm/RegisterForm';
import Link from 'next/link';
import { appRoutes } from '@/_routes/routes';

export const metadata: Metadata = {
  title: 'Sign Up - AVOO App',
  description: 'Create your professional account on AVOO App',
};

export default function SignUpPage() {
  return (
    <div className='flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h1 className='text-center text-3xl font-bold leading-9 tracking-tight text-gray-900'>
          AVOO App
        </h1>
        <h2 className='mt-2 text-center text-lg text-gray-600'>Create a professional account</h2>
        <p className='text-center text-lg text-gray-600'>
          Create an account or login in your business
        </p>
      </div>

      <RegisterForm />

      <div className='sm:mx-auto sm:w-full sm:max-w-sm mt-4'>
        <p className='text-center text-gray-600'>
          Having account?{' '}
          <Link href={appRoutes.SignIn} className='text-blue-600 hover:underline'>
            Log in
          </Link>
        </p>

        <div className='flex justify-between items-center mt-8 text-sm text-gray-600'>
          <span>© 2025 Avoo</span>
          <Link href='#' className='text-blue-600 hover:underline'>
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
