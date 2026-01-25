import React from 'react';
import { tv } from 'tailwind-variants';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { colors } from '@avoo/design-tokens';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';

type Props = {
  item: MasterWithRelationsEntity;
  onClick?: () => void;
  isCard?: boolean;
};

const WrapperStyles = tv({
  base: 'flex gap-3 items-center justify-between rounded-lg w-full border border-gray-200',
  variants: {
    isCard: {
      true: 'p-4 ',
      false: 'cursor-pointer p-2 hover:bg-primary-100 focus:bg-primary-100 transition-colors group',
    },
  },
});

export default function MasterElement(props: Props) {
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
      <div className='shrink-0 flex items-center gap-3'>
        <Avatar
          name={item.name || ''}
          src={undefined}
          size={AvatarSize.Large}
          bgColor={colors.primary[100]}
          className='group-hover:bg-primary-200! group-focus:bg-primary-200! transition-colors shrink-0'
        />
        <h4 className='font-medium text-sm text-start leading-normal text-gray-700'>{item.name}</h4>
      </div>
      {item.languages && (
        <ul
          className='grid gap-x-1.5 shrink-0'
          style={{
            gridTemplateColumns: `repeat(${Math.ceil(item.languages.length / 2)}, minmax(0, max-content))`,
            direction: 'rtl',
          }}
        >
          {item.languages.map((lang) => (
            <li key={lang} className='text-sm text-gray-500'>
              {lang.toUpperCase()}
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
