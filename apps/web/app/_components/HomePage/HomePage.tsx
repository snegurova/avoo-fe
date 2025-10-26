'use client';
import { useAuthStore } from '@avoo/store';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { useCallback } from 'react';
import { Category } from 'packages/axios/types/apiTypes';

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
  data: Category[];
};

export const HomePage = (props: Props) => {
  const { data } = props;
  const { isAuthenticated, handleLogin } = hooks.useHandleLogin();
  return (
    <div className='container mx-auto p-4'>
      <h1>Home</h1>
      <ul>
        {data.map(({ name, description }) => {
          return (
            <li key={name}>
              <h2>{name}</h2>
              <p>{description}</p>
            </li>
          );
        })}
      </ul>
      <p>User is {isAuthenticated ? 'authenticated' : 'not authenticated'}</p>
      <Button fit={ButtonFit.Inline} intent={ButtonIntent.Primary} onClick={handleLogin}>
        {isAuthenticated ? 'Log out' : 'Log in'}
      </Button>
    </div>
  );
};
