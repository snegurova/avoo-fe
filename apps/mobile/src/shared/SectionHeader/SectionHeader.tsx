import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@/shared/icons';

type Props = {
  title: string;
  onEdit?: () => void;
};

export const SectionHeader = (props: Props) => {
  const { title, onEdit } = props;

  return (
    <View className='flex-row items-center justify-between mb-4'>
      <Text className='text-xl font-bold text-slate-900'>{title}</Text>
      <Pressable className='p-1' onPress={onEdit}>
        <MaterialIcons name='edit' size={14} color='#64748b' />
      </Pressable>
    </View>
  );    
};
