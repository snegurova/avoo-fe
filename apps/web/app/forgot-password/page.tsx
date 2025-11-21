import { Metadata } from 'next/types';
import ForgotPasswordForm from '@/_components/ForgotPasswordForm/ForgotPasswordForm';
import Link from 'next/link';
import { routes } from '@/_routes/routes';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';

export const metadata: Metadata = {
  title: 'Forgot Password - AVOO App',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className='flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h1 className='text-center text-3xl font-bold leading-9 tracking-tight text-gray-900'>
            AVOO App
          </h1>
          <h2 className='mt-2 text-center text-lg text-gray-600'>Forgot Password</h2>
          <p className='mt-2 text-center text-sm text-gray-500'>
            Enter your email to reset your password
          </p>
        </div>

        <ForgotPasswordForm />

        <div className='sm:mx-auto sm:w-full sm:max-w-sm mt-4'>
          <p className='text-center text-gray-600'>
            <Link href={routes.SignIn} className='text-blue-600 hover:underline'>
              Back to login
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
    </AuthGuard>
  );
}
