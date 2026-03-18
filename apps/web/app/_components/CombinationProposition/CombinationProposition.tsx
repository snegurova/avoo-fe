import React from 'react';
import { useTranslations } from 'next-intl';

import { Combination } from '@avoo/axios/types/apiTypes';

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
  const t = useTranslations('private.orders.create');
  const { data, onCancel, onApply } = props;

  return (
    <div className='bg-primary-100 rounded-lg p-4 text-center flex flex-col gap-4 text-sm'>
      <div className=''>
        <p>
          {data.services[0].name} {t('canBeCombined')}{' '}
          {data.services
            .slice(1)
            .map((service) => service.name)
            .join(', ')}
          .
        </p>
        <p>
          {t('totalDurationMessage')}{' '}
          <span className='font-medium'>
            {data.durationMinutes} {t('minutes')}
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
          {t('bookSeparetly')}
        </Button>
        <Button
          fit={ButtonFit.Inline}
          intent={ButtonIntent.Primary}
          radius={ButtonRadius.Full}
          size={ButtonSize.Small}
          onClick={onApply}
        >
          {t('applyCombination')}
        </Button>
      </div>
    </div>
  );
}
