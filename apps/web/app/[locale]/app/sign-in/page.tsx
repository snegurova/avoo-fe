import { Metadata } from 'next/types';
import LoginForm from '@/_components/LoginForm/LoginForm';
import Link from 'next/link';
import { AppRoutes } from '@/_routes/routes';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';

export const metadata: Metadata = {
  title: 'Sign In - AVOO App',
  description: 'Sign in to your AVOO account',
};

export default function SignInPage() {
  return (
    <div className='flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h1 className='text-center text-3xl font-bold leading-9 tracking-tight text-gray-900'>
          AVOO App
        </h1>
        <h2 className='mt-2 text-center text-lg text-gray-600'>Sign in to your AVOO account</h2>
      </div>

      <LoginForm />

      <div className='sm:mx-auto sm:w-full sm:max-w-sm mt-4'>
        <p className='text-center text-gray-600'>
          No account?{' '}
          <LocalizedLink
            href={AppRoutes.SignUp}
            className='text-blue-600 hover:underline'
          >
            Sign up
          </LocalizedLink>
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
