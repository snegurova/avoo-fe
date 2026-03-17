import { Pressable, Text } from 'react-native';

type Props = {
  value: string;
  onPress: () => void;
};

export const SelectableField = (props: Props) => {
  const { value, onPress } = props;
  return (
    <Pressable
      className='flex-row items-center justify-between rounded-lg bg-white border border-gray-200 px-4 py-4'
      onPress={onPress}
    >
      <Text className='text-base text-gray-900'>{value}</Text>
      <Text className='text-sm text-primary-700'>Change</Text>
    </Pressable>
  );
};
