import { memo } from 'react';
import { View, ViewProps } from 'react-native';

type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpacerOrientation = 'vertical' | 'horizontal';

const sizeToHeight: Record<SpacerSize, string> = {
  xs: 'h-1',
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
  xl: 'h-6',
};

const sizeToWidth: Record<SpacerSize, string> = {
  xs: 'w-1',
  sm: 'w-2',
  md: 'w-3',
  lg: 'w-4',
  xl: 'w-6',
};

type Props = {
  size?: SpacerSize;
  orientation?: SpacerOrientation;
  className?: string;
} & Omit<ViewProps, 'style'>;

function Spacer(props: Props) {
  const { size = 'md', orientation = 'vertical', className, ...rest } = props;

  const dimensionClass =
    orientation === 'vertical'
      ? sizeToHeight[size]
      : sizeToWidth[size];

  return (
    <View
      className={['flex-shrink-0', dimensionClass, className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}

export default memo(Spacer);