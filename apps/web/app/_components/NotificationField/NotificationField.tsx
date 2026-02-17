'use client';

import React from 'react';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';

type FieldLike = {
  value?: boolean;
  onChange: (checked: boolean) => void;
};

type Props = {
  field: FieldLike;
  label?: string;
  description?: string;
};

export default function NotificationField({
  field,
  label = 'Notification',
  description = 'Automatically sending appointment information to client via email',
}: Props) {
  const handleToggle = React.useCallback(() => {
    field.onChange(!field.value);
  }, [field]);

  return (
    <div className='flex items-center justify-between mt-2'>
      <div className='text-sm'>
        <div>{label}</div>
        <p className='text-xs text-gray-500 mt-1 break-words'>{description}</p>
      </div>

      <ToggleSwitch
        ariaLabel='Toggle send notifications'
        checked={!!field.value}
        onChange={handleToggle}
      />
    </div>
  );
}
