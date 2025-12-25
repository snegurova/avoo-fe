import React from 'react';
import { tv } from 'tailwind-variants';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

type Props = {
  options: {
    label: string;
    handler: () => void;
    items?: { label: string | null; handler: () => void }[];
  }[];
};

const dropdown = tv({
  base: 'absolute top-full min-w-max translate-y-2 overflow-hidden rounded-2xl z-15 right-0 bg-white border border-gray-200 py-4 px-3 translate-x-2',
});

export default function CheckboxesList(props: Props) {
  const { options } = props;

  return (
    <div className={dropdown()}>
      {options.map((option, index) => (
        <div key={index} className='mb-2 last:mb-0'>
          <FormControlLabel
            control={<Checkbox onChange={option.handler} size='small' />}
            label={option.label}
            onChange={() => {}}
          />
          {option.items &&
            option.items.map((item, idx) => (
              <div key={idx} className='pl-6'>
                <FormControlLabel
                  control={<Checkbox onChange={item.handler} size='small' />}
                  label={item.label}
                  onChange={() => {}}
                />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
