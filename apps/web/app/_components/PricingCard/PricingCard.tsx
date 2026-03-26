import { type MouseEventHandler } from 'react';

import { tv } from 'tailwind-variants';

import { Button, ButtonFit, ButtonIntent, ButtonSize } from '@/_components/Button/Button';
import CheckCircle from '@/_icons/CheckCircle';

const landingPrimaryButtonClassName =
  '!border !border-black !duration-300 hover:!border-primary-500 focus:!border-primary-500';
const landingButtonLayoutClassName = '!h-12 !shrink-0 !rounded-lg !px-6 whitespace-nowrap';

const pricingCard = tv({
  base: 'flex h-full flex-col rounded-[2rem] border-2 bg-white p-6 shadow-[0_30px_80px_-55px_rgba(160,99,196,0.6)] sm:p-8',
  variants: {
    featured: {
      true: 'border-primary-400',
      false: 'border-primary-300',
    },
  },
  defaultVariants: {
    featured: false,
  },
});

type PricingCardProps = {
  title: string;
  subtitle: string;
  price: string;
  suffix: string;
  features: string[];
  ctaLabel: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  featured?: boolean;
};

export default function PricingCard(props: PricingCardProps) {
  const { title, subtitle, price, suffix, features, ctaLabel, onClick, featured = false } = props;

  return (
    <article className={pricingCard({ featured })}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 border-b border-primary-300 pb-6 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h3 className='text-2xl font-semibold text-black'>{title}</h3>
            <p className='mt-2 text-sm leading-6 text-gray-600'>{subtitle}</p>
          </div>
          <p className='text-right text-black'>
            <span className='text-4xl font-bold tracking-[-0.04em] sm:text-5xl'>{price}</span>
            <span className='text-2xl font-semibold'>/{suffix}</span>
          </p>
        </div>

        <ul className='grid gap-4 text-sm text-gray-700'>
          {features.map((feature) => (
            <li key={feature} className='flex items-start gap-3'>
              <CheckCircle className='mt-0.5 size-5 shrink-0 fill-black' />
              <span className='leading-6'>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='mt-8'>
        <Button
          fit={ButtonFit.Fill}
          intent={ButtonIntent.Primary}
          size={ButtonSize.Small}
          className={`min-w-0! ${landingButtonLayoutClassName} ${landingPrimaryButtonClassName}`}
          onClick={onClick}
        >
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
