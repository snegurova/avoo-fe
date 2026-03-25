import { Switch, Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  title: string;
  description?: string;
};

export const BooleanFormField = (props: Props) => {
  const { value, onChange, title, description } = props;

  return (
    <View className='flex-row items-center justify-between py-2 mb-4'>
      <View className='flex-1 mr-4'>
        <Text className='text-sm font-medium text-gray-900'>{title}</Text>
        {description && <Text className='text-xs text-gray-500 mt-0.5'>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.gray[300], true: colors.primary[700] }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.gray[300]}
      />
    </View>
  );
};
