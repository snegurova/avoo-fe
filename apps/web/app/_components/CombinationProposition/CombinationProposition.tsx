import { Combination } from '@avoo/axios/types/apiTypes';
import React from 'react';
import {
  Button,
  ButtonFit,
  ButtonIntent,
  ButtonRadius,
  ButtonSize,
} from '@/_components/Button/Button';

type Props = {
  data: Combination;
  onCancel: () => void;
  onApply: () => void;
};

export default function CombinationProposition(props: Props) {
  const { data, onCancel, onApply } = props;

  return (
    <div className='bg-primary-100 rounded-lg p-4 text-center flex flex-col gap-4 text-sm'>
      <div className=''>
        <p>
          {data.services[0].name} can be combined with{' '}
          {data.services
            .slice(1)
            .map((service) => service.name)
            .join(', ')}
          .
        </p>
        <p>
          The total appointment duration will be{' '}
          <span className='font-medium'>{data.durationMinutes} minutes</span>.
        </p>
      </div>
      <div className='flex gap-6 justify-center'>
        <Button
          fit={ButtonFit.Inline}
          intent={ButtonIntent.Simple}
          radius={ButtonRadius.Full}
          size={ButtonSize.Small}
          onClick={onCancel}
        >
          Book separately
        </Button>
        <Button
          fit={ButtonFit.Inline}
          intent={ButtonIntent.Primary}
          radius={ButtonRadius.Full}
          size={ButtonSize.Small}
          onClick={onApply}
        >
          Apply combination
        </Button>
      </div>
    </div>
  );
}
