'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='container flex flex-col items-center gap-10'>
      Home Public Page
      <Link href='/app' className='bg-dark text-white py-2.5 px-4 rounded-2xl'>
        Go to App
      </Link>
    </div>
  );
}
