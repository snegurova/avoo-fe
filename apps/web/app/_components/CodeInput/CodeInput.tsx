import React, { useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export default function CodeInput({ value, onChange, length = 6, disabled }: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, '');
    let newValue = value.split('');
    if (val.length > 1) {
      for (let i = 0; i < val.length && idx + i < length; i++) {
        newValue[idx + i] = val[i];
      }
      onChange(newValue.join('').slice(0, length));
      const nextIdx = Math.min(idx + val.length, length - 1);
      inputsRef.current[nextIdx]?.focus();
    } else {
      newValue[idx] = val;
      onChange(newValue.join('').slice(0, length));
      if (val && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      if (value[idx]) {
        let newValue = value.split('');
        newValue[idx] = '';
        onChange(newValue.join(''));
      } else if (idx > 0) {
        let newValue = value.split('');
        newValue[idx - 1] = '';
        onChange(newValue.join(''));
        inputsRef.current[idx - 1]?.focus();
        e.preventDefault();
      }
    } else if (e.key === 'Delete') {
      let newValue = value.split('');
      newValue[idx] = '';
      onChange(newValue.join(''));
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '');
    if (pasted.length === length) {
      onChange(pasted.slice(0, length));
      setTimeout(() => {
        inputsRef.current[length - 1]?.focus();
      }, 0);
      e.preventDefault();
    }
  };

  return (
    <div className='flex flex-nowrap gap-3 justify-center'>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          disabled={disabled}
          className='w-11 h-11 text-center border-gray-200 border text-[2rem] leading-none font-bold rounded-lg outline-0 transition-colors focus:border-primary-400'
        />
      ))}
    </div>
  );
}
