import { useCallback } from 'react';
import type { FieldValues, UseFormSetError, Path } from 'react-hook-form';

type ServerError = {
  errors?: Array<{ field?: string; message?: string }>;
  errorMessage?: string;
};

export function useServerFormErrors<T extends FieldValues>(setError: UseFormSetError<T>) {
  return useCallback(
    (maybeErr: unknown): boolean => {
      const maybe = maybeErr as ServerError;
      if (Array.isArray(maybe?.errors)) {
        maybe.errors.forEach((fieldError) => {
          if (fieldError.field) {
            setError(fieldError.field as unknown as Path<T>, {
              type: 'server',
              message: fieldError.message ?? 'Validation error',
            });
          }
        });
        return true;
      }
      return false;
    },
    [setError],
  );
}

export default useServerFormErrors;
