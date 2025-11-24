import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';
import { scheduleHooks } from '@avoo/hooks';
import { RootNavigationProp, RootScreens } from '@/types/navigation';


export const ProfileSchedule = () => {
  const schedules = scheduleHooks.useGetSchedules();
  const hasSchedules = schedules?.items && schedules.items.length > 0;
  const navigation = useNavigation<RootNavigationProp>();

  const handleNavigate = () => {
    navigation.navigate(RootScreens.WorkingHoursScreen);
  };

  return (
    <View className='px-5 py-4 border-t border-gray-200'>
      <SectionHeader title='Working hours' onEdit={handleNavigate} />

      {!hasSchedules && (
        <Text className='text-sm text-slate-500'>
          Set up your working hours{' '}
          <Text className='text-sm text-blue-600 underline' onPress={handleNavigate}>
            Calendar Settings
          </Text>
        </Text>
      )}

      {hasSchedules && (
        <View className='gap-2'>
          {schedules.items.map((item, index) => (
            <View key={index} className='flex-row items-center justify-between'>
              <Text className='text-base text-slate-900'>{item.name}</Text>
              <Text className='text-base text-slate-700'>{item.pattern}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ProfileSchedule;
