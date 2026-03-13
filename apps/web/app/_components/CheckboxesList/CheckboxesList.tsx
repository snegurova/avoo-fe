import React, { useEffect, useRef, useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { tv } from 'tailwind-variants';

type Props = {
  options: {
    label: string | React.ReactNode;
    handler: () => void;
    items?: { label: string | null; id: number | string; handler: () => void }[];
  }[];
  values: ((string | number)[] | boolean | undefined)[];
  Item?: React.ReactNode;
};

const dropdown = tv({
  base: 'absolute top-full min-w-max translate-y-2 overflow-hidden rounded-2xl z-15 right-0 bg-white border border-gray-200 py-4 px-3 translate-x-2',
});

export default function CheckboxesList(props: Props) {
  const { options, values, Item } = props;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);

  useEffect(() => {
    const updateDropdownPosition = () => {
      const dropdownEl = dropdownRef.current;
      if (!dropdownEl) return;
      const rect = dropdownEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const bottomSpace = viewportHeight - rect.top;
      const minBottomMargin = 16;
      if (rect.height + minBottomMargin > bottomSpace) {
        setMaxHeight(`${bottomSpace - minBottomMargin}px`);
      } else {
        setMaxHeight(undefined);
      }
    };
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={dropdown()}
      style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
    >
      {options.map((option, index) => (
        <div
          key={index}
          className='mb-2 last:mb-0 not-last:border-b not-last:border-b-primary-100 not-last:pb-2 not-last:mb-2'
        >
          {option.items && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      !Array.isArray(values[index]) ||
                      (Array.isArray(values[index]) &&
                        values[index].length >= (option.items?.length || 0))
                    }
                    onChange={option.handler}
                    size='small'
                  />
                }
                label={option.label}
                classes={{
                  label: 'transition-colors hover:text-primary-500',
                }}
              />
              {option.items &&
                option.items.map((item, idx) => (
                  <div key={idx} className='pl-6'>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            !values[index] ||
                            (Array.isArray(values[index]) && values[index].includes(item.id || ''))
                          }
                          onChange={item.handler}
                          size='small'
                        />
                      }
                      label={item.label}
                      classes={{
                        label: 'transition-colors hover:text-primary-500',
                      }}
                    />
                  </div>
                ))}
            </>
          )}
          {!option.items && (
            <FormControlLabel
              control={
                <Checkbox checked={!!values[index]} onChange={option.handler} size='small' />
              }
              label={option.label}
              classes={{
                label: 'transition-colors hover:text-primary-500',
              }}
            />
          )}
        </div>
      ))}
      {Item && <>{Item}</>}
    </div>
  );
}
