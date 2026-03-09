import * as React from 'react';

export const toVoidHandler =
  <T extends () => unknown>(fn: T) =>
  () =>
    fn();

export const toHandlerWithValue = <T, R>(fn: (value: T) => R, value: T) => {
  return () => fn(value);
};

export const toInputHandler = <T>(fn: (value: string) => T) => {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    fn(event.target.value);
  };
};
