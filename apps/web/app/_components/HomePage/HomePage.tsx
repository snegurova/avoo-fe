'use client';
import { useAuthStore } from '@avoo/store';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { useCallback } from 'react';

const hooks = {
  useHandleLogin() {
    const { isAuthenticated, setIsAuthenticated } = useAuthStore();

    const handleLogin = useCallback(() => {
      setIsAuthenticated(!isAuthenticated);
    }, [isAuthenticated, setIsAuthenticated]);

    return { isAuthenticated, handleLogin };
  },
};

export type Props = {
  data: { message: string };
};

export const HomePage = (props: Props) => {
  const {
    data: { message },
  } = props;
  const { isAuthenticated, handleLogin } = hooks.useHandleLogin();
  return (
    <div className='container mx-auto p-4'>
      <h1>Home</h1>
      <p>{message}</p>
      <p>User is {isAuthenticated ? 'authenticated' : 'not authenticated'}</p>
      <Button fit={ButtonFit.Inline} intent={ButtonIntent.Primary} onClick={handleLogin}>
        {isAuthenticated ? 'Log out' : 'Log in'}
      </Button>
    </div>
  );
};
