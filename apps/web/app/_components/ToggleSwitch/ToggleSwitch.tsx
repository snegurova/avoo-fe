import React from 'react';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
};

const TRACK_W = 32;
const TRACK_H = 14;
const KNOB = 20;
const MOVE_X = TRACK_W - KNOB;
export default function ToggleSwitch({ checked, onChange, ariaLabel }: Props) {
  
  const knobStyle = React.useMemo<React.CSSProperties>(
    () => ({
      width: KNOB,
      height: KNOB,
      left: 0,
      top: '50%',
      transform: `translate(${checked ? MOVE_X : 0}px, -50%)`,
      transition: 'transform 300ms cubic-bezier(.2,.8,.2,1)',
    }),
    [checked]
  );

  const handleToggle = React.useCallback(() => {
    onChange(!checked);
  }, [onChange, checked]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  return (
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none`}
      style={{ width: TRACK_W, height: TRACK_H }}
    >
      <span
        aria-hidden
        className={`${checked ? 'bg-purple-300' : 'bg-gray-200'} absolute inset-0 rounded-full`}
        style={{ width: TRACK_W, height: TRACK_H }}
      />

      <span
        className={`${checked ? 'bg-primary-800' : 'bg-gray-500'} absolute rounded-full`}
        style={knobStyle}
      />
    </button>
  );
}
