import React from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

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
  isPublic?: boolean;
};

const wrapper = tv({
  base: 'rounded-lg p-4 text-center flex flex-col gap-4 text-sm',
  variants: {
    isPublic: {
      true: 'bg-gray-100 text-black',
      false: 'bg-primary-100',
    },
  },
});

export default function CombinationProposition(props: Props) {
  const t = useTranslations('private.orders.create');
  const tPublic = useTranslations('public.salon.createOrder');
  const { data, onCancel, onApply, isPublic = false } = props;

  return (
    <div className={wrapper({ isPublic })}>
      <div className=''>
        {isPublic ? (
          <p>{tPublic('combineProposition')}</p>
        ) : (
          <>
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
          </>
        )}
      </div>
      <div className='flex gap-6 justify-center'>
        <Button
          fit={ButtonFit.Inline}
          intent={ButtonIntent.Simple}
          radius={ButtonRadius.Full}
          size={ButtonSize.Small}
          onClick={onCancel}
        >
          {isPublic ? tPublic('no') : t('bookSeparately')}
        </Button>
        <Button
          fit={ButtonFit.Inline}
          intent={ButtonIntent.Primary}
          radius={ButtonRadius.Full}
          size={ButtonSize.Small}
          onClick={onApply}
        >
          {isPublic ? tPublic('yes') : t('applyCombination')}
        </Button>
      </div>
    </div>
  );
}
