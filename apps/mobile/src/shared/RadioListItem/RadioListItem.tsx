import { Pressable, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '@avoo/design-tokens';

type Props = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export const RadioListItem = ({ label, isSelected, onPress }: Props) => (
  <Pressable
    className='flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-2'
    onPress={onPress}
  >
    <Text className='text-sm text-gray-900'>{label}</Text>
    <View
      className={`w-5 h-5 rounded-full border items-center justify-center ${isSelected ? 'bg-primary-700 border-primary-700' : 'border-gray-400'}`}
    >
      {isSelected && <MaterialIcons name='check' size={14} color={colors.white} />}
    </View>
  </Pressable>
);
