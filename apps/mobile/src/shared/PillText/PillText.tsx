import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import React from 'react';

type Props = {
  children: string | React.ReactNode;
};

export function PillText(props: Props) {
  const { children } = props;
  return (
    <View className='px-3 py-1 rounded-xl border border-gray-200'>
      {typeof children === 'string' ? (
        <Text variant='bodySmall' style={{ color: colors.gray[700] }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
