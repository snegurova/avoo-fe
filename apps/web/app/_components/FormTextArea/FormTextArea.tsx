import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

const textarea = tv({
  base: 'block w-full rounded-lg border p-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-800 text-sm',
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

const container = tv({ base: '' });

const header = tv({ base: 'flex items-center justify-between mb-1' });
const labelClass = tv({ base: 'text-sm' });
const counterClass = tv({ base: 'text-sm text-gray-600' });
const helperClass = tv({ base: 'mt-1 text-xs text-gray-500' });
const errorText = tv({ base: 'mt-1 text-sm text-red-500' });

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  label?: string;
  helperText?: string;
  maxLength?: number;
  showCounter?: boolean;
  error?: string;
  classNames?: {
    container?: string;
    textarea?: string;
    label?: string;
    header?: string;
    counter?: string;
    helper?: string;
    error?: string;
  };
  textareaClassAppend?: string;
};

const FormTextarea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const {
    label,
    helperText,
    maxLength = 200,
    showCounter = true,
    error,
    classNames,
    value,
    textareaClassAppend,
    ...rest
  } = props;

  const hasError = !!error;
  const valStr = String(value ?? '');
  const length = valStr.length;

  const textareaClassNameBase = classNames?.textarea
    ? classNames.textarea
    : textarea({ error: hasError });
  const textareaClassName = `${textareaClassNameBase} ${textareaClassAppend ?? ''}`.trim();

  const containerClassName = classNames?.container || container();
  const headerClassName = classNames?.header || header();
  const labelClassName = classNames?.label || labelClass();
  const counterClassName = classNames?.counter || counterClass();
  const helperClassName = classNames?.helper || helperClass();
  const errorClassName = classNames?.error || errorText();

  const helperId = helperText ? `${rest.id ?? rest.name}-help` : undefined;

  return (
    <div className={containerClassName}>
      {(label || showCounter) && (
        <div className={headerClassName}>
          <label htmlFor={rest.id} className={labelClassName}>
            {label}
          </label>
          {showCounter && (
            <div className={counterClassName}>
              {length}/{maxLength}
            </div>
          )}
        </div>
      )}

      <textarea
        {...rest}
        ref={ref}
        value={value}
        aria-describedby={helperId}
        maxLength={maxLength}
        className={textareaClassName}
      />

      {helperText && (
        <p id={helperId} className={helperClassName}>
          {helperText}
        </p>
      )}
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
