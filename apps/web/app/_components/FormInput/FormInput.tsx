import { InputHTMLAttributes, ReactNode } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  error?: string;
  className?: string;
  accessoryRight?: ReactNode;
  classNames?: {
    container?: string;
    input?: string;
    error?: string;
  };
}

export default function FormInput(props: Props) {
  const { error, className = '', classNames, accessoryRight, ...rest } = props;

  const errorClasses = error ? 'border-red-500' : 'border-gray-200';
  const baseClasses =
    'block w-full rounded-lg border bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500';
  const inputPaddingRight = accessoryRight ? 'pr-12' : '';

  const inputClassName = classNames?.input
    ? classNames.input
    : `${baseClasses} ${errorClasses} ${inputPaddingRight} ${className || ''}`.trim();

  const containerClassName = classNames?.container || '';

  const errorClassName = classNames?.error ? classNames.error : 'mt-1 text-sm text-red-500';

  return (
    <div className={containerClassName}>
      <div className={accessoryRight ? 'relative' : ''}>
        <input {...rest} className={inputClassName} />
        {accessoryRight && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2'>{accessoryRight}</div>
        )}
      </div>
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}
