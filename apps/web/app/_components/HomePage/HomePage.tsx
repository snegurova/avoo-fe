'use client';
import { useAuthStore } from '@avoo/store';

export type Props = {
  data: { message: string };
};

export const HomePage = (props: Props) => {
  const {
    data: { message },
  } = props;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <>
      <h1>Home</h1>
      <p>{message}</p>
      <p>User is {isAuthenticated ? 'authenticated' : 'not authenticated'}</p>
    </>
  );
};
