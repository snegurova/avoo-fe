import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Combination } from '@avoo/axios/types/apiTypes';
import { messages } from '@avoo/intl/messages/private/orders/create';

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
          {data.services[0].name} <FormattedMessage {...messages.canBeCombined} />{' '}
          {data.services
            .slice(1)
            .map((service) => service.name)
            .join(', ')}
          .
        </p>
        <p>
          <FormattedMessage {...messages.totalDurationMessage} />{' '}
          <span className='font-medium'>
            {data.durationMinutes} <FormattedMessage {...messages.minutes} />
          </span>
          .
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
          <FormattedMessage {...messages.bookSeparetly} />
        </Button>
        <Button
          fit={ButtonFit.Inline}
          intent={ButtonIntent.Primary}
          radius={ButtonRadius.Full}
          size={ButtonSize.Small}
          onClick={onApply}
        >
          <FormattedMessage {...messages.applyCombination} />
        </Button>
      </div>
    </div>
  );
}
