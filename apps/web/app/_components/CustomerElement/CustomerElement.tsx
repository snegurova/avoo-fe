import React from 'react';
import { Customer } from '@avoo/axios/types/apiTypes';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { colors } from '@avoo/design-tokens';
import { tv } from 'tailwind-variants';

type Props = {
  item: Customer;
  onClick?: () => void;
  isCard?: boolean;
};

const WrapperStyles = tv({
  base: 'flex gap-3 items-center rounded-lg w-full',
  variants: {
    isCard: {
      true: 'p-4 border border-gray-200',
      false: 'cursor-pointer p-2 hover:bg-primary-100 focus:bg-primary-100 transition-colors group',
    },
  },
});

const secondaryText = tv({
  base: '',
  variants: {
    isCard: {
      true: 'text-gray-500',
      false: '',
    },
  },
});

export default function CustomerElement(props: Props) {
  const { item, onClick, isCard } = props;

  const Wrapper = isCard ? 'div' : 'button';

  return (
    <Wrapper
      className={WrapperStyles({ isCard })}
      {...(!isCard && {
        type: 'button',
        onClick,
      })}
    >
      <div className='shrink-0'>
        <Avatar
          name={item.name}
          src={undefined}
          size={AvatarSize.Large}
          bgColor={colors.primary[100]}
          className='group-hover:bg-primary-200! group-focus:bg-primary-200! transition-colors'
        />
      </div>
      <div className='text-sm text-start leading-normal text-gray-700 grow'>
        <h4 className='font-medium'>{item.name}</h4>
        <p className={secondaryText({ isCard })}>{item.email}</p>
        <span className={secondaryText({ isCard })}>{item.phone}</span>
        {isCard && item.lastVisit && (
          <div className='mt-2 pt-2 border-t border-primary-100 flex gap-1'>
            <span className='text-xs text-gray-500'>last visit</span>
            <span className='text-xs'>{new Date(item.lastVisit).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
