import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { ScheduleEntity } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { scheduleHooks } from '@avoo/hooks';

import { ScheduleListItem } from '@/components/ScheduleListItem/ScheduleListItem';
import { EditCalendarIcon } from '@/icons/EditCalendarIcon';

type Props = {
  onSelectSchedule: (schedule: ScheduleEntity) => void;
  onCreatePress: () => void;
};

export const ScheduleList = (props: Props) => {
  const { onSelectSchedule, onCreatePress } = props;
  const { data, isFetching, fetchNextPage, hasNextPage } = scheduleHooks.useGetSchedulesInfinite({
    limit: 10,
  });
  const schedules = data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  if (isFetching && schedules.length === 0) {
    return <ActivityIndicator />;
  }

  if (schedules.length === 0) {
    return (
      <View className='flex-1 justify-center items-center px-6'>
        <View className='w-[150px] h-[150px] rounded-full bg-primary-100 justify-center items-center mb-8'>
          <EditCalendarIcon size={100} color={colors.primary[300]} />
        </View>
        <Text className='text-xl font-bold text-gray-900 mb-3 text-center'>
          Set up your working schedule
        </Text>
        <Text className='text-sm text-gray-500 text-center leading-5'>
          <Text className='text-primary-700' onPress={onCreatePress}>
            Create a working schedule
          </Text>
          {' to define when your masters are available for bookings.'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={schedules}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ paddingBottom: 24 }}
      renderItem={({ item }) => (
        <ScheduleListItem schedule={item} onPress={() => onSelectSchedule(item)} />
      )}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
    />
  );
};
