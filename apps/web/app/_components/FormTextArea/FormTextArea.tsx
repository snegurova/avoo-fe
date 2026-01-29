import { TextareaHTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

const input = tv({
  base: 'block w-full rounded-lg border p-3 text-gray-900 focus:outline-none focus-within:[border-color:var(--color-primary-700)] text-sm leading-none',
  variants: {
    error: {
      true: 'border-red-500',
      false: 'border-gray-200',
    },
  },
  defaultVariants: {
    error: false,
  },
});

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  error?: string;
  className?: string;
};
export default function FormTextArea(props: Props) {
  const { error, className = '', ...rest } = props;
  const hasError = !!error;

  return (
    <div>
      <div>
        <textarea
          {...rest}
          className={input({
            error: hasError,
            className,
          })}
        />
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
}
