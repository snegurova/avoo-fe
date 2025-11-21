import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';
import { scheduleHooks } from '@avoo/hooks';
import { RootScreens } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileSchedule = () => {
  const schedules = scheduleHooks.useGetSchedules();
  const hasSchedules = schedules?.items && schedules.items.length > 0;
  const navigation = useNavigation<NavigationProp>();

  const handleEdit = () => {
    navigation.navigate(RootScreens.WorkingHoursScreen);
  };

  if (!hasSchedules) {
    return (
      <View className='px-5 py-4 border-t border-gray-200'>
        <SectionHeader title='Working hours' onEdit={handleEdit} />
        <Text className='text-sm text-slate-500'>
          Set up your working hours{' '}
          <Text className='text-sm text-blue-600 underline' onPress={handleEdit}>
            Calendar Settings
          </Text>
        </Text>
      </View>
    );
  }

  return (
    <View className='px-5 py-4 border-t border-gray-200'>
      <SectionHeader title='Working hours' onEdit={handleEdit} />

      <View className='gap-2'>
        {schedules.items.map((item, index) => (
          <View key={index} className='flex-row items-center justify-between'>
            <Text className='text-base text-slate-900'>{item.name}</Text>
            <Text className='text-base text-slate-700'>{item.pattern}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfileSchedule;
